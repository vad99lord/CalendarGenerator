import BottomButton from "@components/BottomButton/BottomButton";
import SelectableUser from "@components/User/SelectableUser";
import useLocalStore from "@hooks/useLocalStore";
import useVkApiFetchStore from "@hooks/useVkApiFetchStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { LoadState } from "@stores/LoadState";
import {
  Button,
  Checkbox,
  Counter,
  Footer,
  FormItem,
  Group,
  List,
  Pagination,
  Search,
  SimpleCell,
  SizeType,
  Spinner,
  Switch,
} from "@vkontakte/vkui";
import { Observer, observer } from "mobx-react-lite";
import UsersPaginationStore from "./UsersPaginationStore";

export type UsersPickerConfig = {
  enableSelectAll?: boolean;
  selectableWithoutBirthday?: boolean;
};

export interface UsersPaginationProps extends UsersPickerConfig {
  checkedUsersStore: ICheckedUsersStore;
  onNextClick: () => void;
  onOpenChecked: () => void;
}

const UsersPagination = ({
  checkedUsersStore,
  onNextClick,
  onOpenChecked,
  enableSelectAll = true,
  selectableWithoutBirthday = true,
}: UsersPaginationProps) => {
  const fetchStore = useVkApiFetchStore("PaginateFriendsByQuery");
  const usersStore = useLocalStore(
    UsersPaginationStore,
    checkedUsersStore,
    fetchStore
  );

  const userItems = usersStore.selectableUsers.map(
    ({ user, isSelectable }) => (
      <Observer key={user.id}>
        {() => (
          <SelectableUser
            user={user}
            checked={Boolean(checkedUsersStore.checked.get(user.id))}
            disabled={!isSelectable}
            onUserCheckChanged={checkedUsersStore.toggleCheck}
            showBirthday
          />
        )}
      </Observer>
    )
  );

  return (
    <Group>
      <Observer>
        {() => (
          <Search
            value={usersStore.query}
            onChange={usersStore.onSearchTextChange}
            after={null}
          />
        )}
      </Observer>
      <FormItem>
        <Observer>
          {() => (
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
          )}
        </Observer>
      </FormItem>
      {enableSelectAll && (
        <Observer>
          {() => (
            <Checkbox
              checked={usersStore.areAllUsersChecked}
              onChange={usersStore.onSelectAllChanged}
            >
              Выбрать всех
            </Checkbox>
          )}
        </Observer>
      )}
      {selectableWithoutBirthday && (
        <SimpleCell
          sizeY={SizeType.COMPACT}
          Component="label"
          after={
            <Observer>
              {() => (
                <Switch
                  checked={usersStore.ignoreSelectable}
                  onChange={usersStore.toggleIgnoreSelectable}
                />
              )}
            </Observer>
          }
        >
          Ручной выбор
        </SimpleCell>
      )}
      {usersStore.loadState === LoadState.Loading ? (
        <Spinner size="large" />
      ) : userItems.length ? (
        <List>{userItems}</List>
      ) : (
        <Footer>Ничего не найдено</Footer>
      )}
      <Pagination
        style={{ marginBottom: 60 }}
        currentPage={usersStore.currentPage}
        onChange={usersStore.setCurrentPage}
        siblingCount={1}
        boundaryCount={1}
        totalPages={usersStore.totalPagesCount}
      />
      <Observer>
        {() => (
          <BottomButton
            onClick={onNextClick}
            disabled={checkedUsersStore.checkedCount === 0}
          >
            Далее
          </BottomButton>
        )}
      </Observer>
    </Group>
  );
};

export default observer(UsersPagination);
