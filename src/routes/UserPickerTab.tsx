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
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import BottomButton from "../components/BottomButton/BottomButton";
import SelectableUser from "../components/User/SelectableUser";
import useLocalStore from "../hooks/useLocalStore";
import useSearchState from "../hooks/useSearchState";
import useVkApiFetchStore from "../hooks/useVkApiFetchStore";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import UsersComponentStore, {
  UsersSearchParamsNames,
} from "../stores/UsersComponentStore";

export type UserPickerConfig = {
  enableSelectAll?: boolean;
  selectableWithoutBirthday?: boolean;
};

export interface UserPickerTabProps<
  ParamsName extends UsersSearchParamsNames
> extends UserPickerConfig {
  checkedUsersStore: CheckedUsersStore;
  searchParamsName: ParamsName;
  onNextClick: () => void;
  onOpenChecked: () => void;
}

const UserPickerTab = <ParamsName extends UsersSearchParamsNames>({
  checkedUsersStore,
  searchParamsName,
  onNextClick,
  onOpenChecked,
  enableSelectAll = true,
  selectableWithoutBirthday = true,
}: UserPickerTabProps<ParamsName>) => {
  const fetchStore = useVkApiFetchStore(searchParamsName);
  const friendsStore = useLocalStore(
    UsersComponentStore,
    checkedUsersStore,
    fetchStore
  );
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();

  console.log("UserPickerTab RENDER", {
    areAllUsersChecked: toJS(friendsStore.areAllUsersChecked),
    ignoreSelectable: toJS(friendsStore.ignoreSelectable),
    checkedState: toJS(checkedUsersStore.checked),
  });

  useEffect(() => {
    console.log("users fetch", debouncedSearchText);
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
      {enableSelectAll && (
        <Checkbox
          checked={friendsStore.areAllUsersChecked}
          onChange={friendsStore.onSelectAllChanged}
        >
          Выбрать всех
        </Checkbox>
      )}
      {selectableWithoutBirthday && (
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
      )}
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

export default observer(UserPickerTab);
