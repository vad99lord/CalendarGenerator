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
import { useEffect } from "react";
import BottomButton from "../components/BottomButton/BottomButton";
import SelectableUser from "../components/User/SelectableUser";
import useLocalStore from "../hooks/useLocalStore";
import useSearchState from "../hooks/useSearchState";
import useVkApiFetchStore from "../hooks/useVkApiFetchStore";
import { UserModel } from "../network/models/User/UserModel";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import UsersComponentStore from "../stores/UsersComponentStore";

type SelectableUser = {
  user: UserModel;
  isSelectable: boolean;
};

export type FriendsProps = {
  checkedUsersStore: CheckedUsersStore;
  onNextClick: () => void;
  onOpenChecked: () => void;
};

const Friends = ({
  checkedUsersStore,
  onNextClick,
  onOpenChecked,
}: FriendsProps) => {
  const friendsFetchStore = useVkApiFetchStore(
    "SearchFriendsByQuery"
  );
  const friendsStore = useLocalStore(
    UsersComponentStore,
    checkedUsersStore,
    friendsFetchStore
  );
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();

  console.log("FRIENDS RENDER", {
    // areAllSelected,
    // isManualEdit,
    // checkedState,
  });

  useEffect(() => {
    console.log("friends fetch", debouncedSearchText);
    friendsStore.fetch({ query: debouncedSearchText });
  }, [debouncedSearchText, friendsStore]);

  const userItems = friendsStore.selectableUsers.map(
    ({ user, isSelectable }) => (
      <SelectableUser
        key={user.id}
        user={user}
        checked={Boolean(checkedUsersStore.checked.get(user.id))}
        disabled={!isSelectable}
        onUserCheckChanged={checkedUsersStore.toggleCheck}
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
          disabled={checkedUsersStore.checkedCount === 0}
          after={
            <Counter size="s">
              {checkedUsersStore.checkedCount}
            </Counter>
          }
          onClick={onOpenChecked}
        >
          Выбранные пользователи
        </Button>
      </FormItem>
      <Checkbox
        checked={friendsStore.areAllUsersChecked}
        onChange={friendsStore.onSelectAllChanged}
      >
        Выбрать всех
      </Checkbox>
      <SimpleCell
        sizeY={SizeType.COMPACT}
        Component="label"
        after={
          <Switch
            checked={friendsStore.ignoreSelectable}
            onChange={friendsStore.toggleIgnoreSelectable}
          />
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
        disabled={checkedUsersStore.checkedCount === 0}
      >
        Далее
      </BottomButton>
    </Group>
  );
};

export default observer(Friends);
