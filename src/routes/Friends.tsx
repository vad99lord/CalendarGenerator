import {
  Button,
  Checkbox,
  Counter,
  Footer,
  FormItem,
  Group,
  List,
  Search,
  SimpleCell,
  SizeType,
  Switch,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useMemo } from "react";
import BottomButton from "../components/BottomButton/BottomButton";
import SelectableUser from "../components/User/SelectableUser";
import { CheckedUsers } from "../hooks/useCheckedUsersState";
import useLocalStore from "../hooks/useLocalStore";
import useSearchState from "../hooks/useSearchState";
import useSimpleCheckBoxState from "../hooks/useSimpleCheckBoxState";
import useVkApiFetchStore from "../hooks/useVkApiFetchStore";
import {
  isUserSelectable,
  UserModel,
} from "../network/models/User/UserModel";
import FriendsStore from "../stores/FriendsStore";
import { isEmptyArray } from "../utils/utils";

type SelectableUser = {
  user: UserModel;
  isSelectable: boolean;
};

export type FriendsProps = {
  checkedFriends: CheckedUsers;
  onNextClick: () => void;
  onOpenChecked: () => void;
};

const Friends = ({
  checkedFriends: {
    state: checkedState,
    count: checkedCount,
    onUserCheckChanged: onFriendCheckChanged,
    setUsersCheckChanged: setFriendsCheckChanged,
  },
  onNextClick,
  onOpenChecked,
}: FriendsProps) => {
  const friendsFetchStore = useVkApiFetchStore(
    "SearchFriendsByQuery"
  );
  const friendsStore = useLocalStore(FriendsStore, friendsFetchStore);
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();
  const [isManualEdit, setIsManualEdit] =
    useSimpleCheckBoxState(false);
  const { friends } = friendsStore;

  const selectableFriends = useMemo<SelectableUser[]>(
    () =>
      friends.map((user) => ({
        user,
        isSelectable: isManualEdit || isUserSelectable(user),
      })),
    [friends, isManualEdit]
  );
  const enabledFriends = useMemo(
    () =>
      selectableFriends
        .filter((it) => it.isSelectable)
        .map(({ user }) => user),
    [selectableFriends]
  );
  const disabledFriends = useMemo(
    () =>
      selectableFriends
        .filter((it) => !it.isSelectable)
        .map(({ user }) => user),
    [selectableFriends]
  );

  const areAllSelected = useMemo(
    () => enabledFriends.every(({ id }) => checkedState[id]),
    [checkedState, enabledFriends]
  );

  const onSelectAllChanged = useCallback(() => {
    if (!areAllSelected) {
      setFriendsCheckChanged(true, enabledFriends);
    } else {
      setFriendsCheckChanged(false, enabledFriends);
    }
  }, [areAllSelected, enabledFriends, setFriendsCheckChanged]);

  useEffect(() => {
    if (isManualEdit) return;
    if (isEmptyArray(disabledFriends)) return;
    setFriendsCheckChanged(false, disabledFriends);
  }, [disabledFriends, isManualEdit, setFriendsCheckChanged]);

  console.log("FRIENDS RENDER", {
    areAllSelected,
    isManualEdit,
    checkedState,
  });

  useEffect(() => {
    console.log("friends fetch", debouncedSearchText);
    friendsStore.fetch({ query: debouncedSearchText });
  }, [debouncedSearchText, friendsStore]);

  const userItems = selectableFriends.map(
    ({ user, isSelectable }) => (
      <SelectableUser
        key={user.id}
        user={user}
        checked={Boolean(checkedState[user.id])}
        disabled={!isSelectable}
        onUserCheckChanged={onFriendCheckChanged}
        showBirthday
      />
    )
  );

  return (
    <Group>
      <Search
        value={searchText}
        onChange={onSearchChange}
        after={null}
      />
      <FormItem>
        <Button
          size="m"
          appearance="accent"
          stretched={false}
          disabled={checkedCount === 0}
          after={<Counter size="s">{checkedCount}</Counter>}
          onClick={onOpenChecked}
        >
          Выбранные пользователи
        </Button>
      </FormItem>
      <Checkbox
        checked={areAllSelected}
        onChange={onSelectAllChanged}
      >
        Выбрать всех
      </Checkbox>
      <SimpleCell
        sizeY={SizeType.COMPACT}
        Component="label"
        after={
          <Switch checked={isManualEdit} onChange={setIsManualEdit} />
        }
      >
        Ручной выбор
      </SimpleCell>
      {userItems.length ? (
        <List style={{ marginBottom: 60 }}>{userItems}</List>
      ) : (
        <Footer>Ничего не найдено</Footer>
      )}
      <BottomButton
        onClick={onNextClick}
        disabled={checkedCount === 0}
      >
        Далее
      </BottomButton>
    </Group>
  );
};

export default observer(Friends);
