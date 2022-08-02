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
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import BottomButton from "../components/BottomButton/BottomButton";
import SelectableUser from "../components/User/SelectableUser";
import { LaunchParamsContext } from "../contexts/LaunchParamsContext";
import { TokenContext } from "../contexts/TokenContext";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { CheckedUsers } from "../hooks/useCheckedUsersState";
import useSearchState from "../hooks/useSearchState";
import useSimpleCheckBoxState from "../hooks/useSimpleCheckBoxState";
import userApiToUser from "../network/models/User/userApiToUser";
import { isUserSelectable, UserModel } from "../network/models/User/UserModel";
import { fetchVkApi } from "../network/vk/fetchVkApi";
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
  const launchParams = useContext(LaunchParamsContext);
  const token = useContext(TokenContext);
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();
  const [isManualEdit, setIsManualEdit] =
    useSimpleCheckBoxState(false);

  const [friends, setFriends] = useState<UserModel[]>([]);

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

  useAsyncEffect(async () => {
    console.log(
      "friends fetch",
      debouncedSearchText,
      token,
      launchParams
    );
    if (!token || !launchParams) return;
    const { data: friends, isError } = await fetchVkApi(
      "friends.search",
      {
        user_id: launchParams.vk_user_id,
        q: debouncedSearchText,
        count: 20,
        offset: 0,
        //TODO extract to typed const somehow
        fields: "bdate,photo_100,photo_200,photo_max",
      },
      token
    );
    if (!isError) {
      console.log(JSON.stringify(friends));
      const modelFriends = friends.items.map(userApiToUser);
      setFriends(modelFriends);
    }
  }, [token, launchParams, debouncedSearchText]);

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

export default Friends;
