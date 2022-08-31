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
import BottomButton from "../components/BottomButton/BottomButton";
import SelectableUser from "../components/User/SelectableUser";
import { CacheContext } from "../contexts/CacheContext";
import { useLateInitContext } from "../hooks/useLateInitContext";
import useLocalStore from "../hooks/useLocalStore";
import useVkApiFetchStore from "../hooks/useVkApiFetchStore";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import UsersComponentStore, {
  UsersSearchParamsNames,
} from "../stores/UsersComponentStore";

export type UserPickerConfig = {
  enableSelectAll?: boolean;
  selectableWithoutBirthday?: boolean;
};

export type UserPickerTabOuterProps = Pick<
  UserPickerTabProps<any>,
  "onNextClick" | "onOpenChecked" | "checkedUsersStore"
>;

export interface UserPickerTabProps<
  ParamsName extends UsersSearchParamsNames
> extends UserPickerConfig {
  checkedUsersStore: CheckedUsersStore;
  searchParamsName: ParamsName;
  onNextClick: () => void;
  onOpenChecked: () => void;
  componentId: symbol;
}

const UserPickerTab = <ParamsName extends UsersSearchParamsNames>({
  checkedUsersStore,
  searchParamsName,
  onNextClick,
  onOpenChecked,
  componentId,
  enableSelectAll = true,
  selectableWithoutBirthday = true,
}: UserPickerTabProps<ParamsName>) => {
  const fetchStore = useVkApiFetchStore(searchParamsName);
  const cacheStore = useLateInitContext(CacheContext);
  const usersStore = useLocalStore(
    UsersComponentStore,
    componentId,
    checkedUsersStore,
    fetchStore,
    cacheStore
  );

  console.log("UserPickerTab RENDER", {
    areAllUsersChecked: toJS(usersStore.areAllUsersChecked),
    ignoreSelectable: toJS(usersStore.ignoreSelectable),
    checkedState: toJS(checkedUsersStore.checked),
  });

  const userItems = usersStore.selectableUsers.map(
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
        value={usersStore.query}
        onChange={usersStore.onSearchTextChange}
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
          checked={usersStore.areAllUsersChecked}
          onChange={usersStore.onSelectAllChanged}
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
              checked={usersStore.ignoreSelectable}
              onChange={usersStore.toggleIgnoreSelectable}
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
