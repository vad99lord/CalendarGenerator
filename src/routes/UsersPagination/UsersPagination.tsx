import BottomButton from "@components/BottomButton/BottomButton";
import SelectableUser from "@components/User/SelectableUser";
import useLocalCachedStore from "@hooks/useLocalCachedStore";
import { useVkApiFetchStoreCallback } from "@hooks/useVkApiFetchStore";
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
  PaginationProps,
  Search,
  SimpleCell,
  SizeType,
  Spinner,
  Switch,
} from "@vkontakte/vkui";
import { Observer, observer } from "mobx-react-lite";
import { ScopeId } from "../ChooseUsers/ChooseUsers";
import UsersPaginationStore, {
  UsersPaginationParamsNames,
} from "./UsersPaginationStore";

export type UsersPickerConfig = {
  enableSelectAll?: boolean;
  selectableWithoutBirthday?: boolean;
};

export interface PaginationConfig
  extends Pick<PaginationProps, "siblingCount" | "boundaryCount"> {}

export type StoreId = {
  storeId: symbol;
};

export interface UsersPaginationProps<
  ParamsName extends UsersPaginationParamsNames
> extends UsersPickerConfig,
    PaginationConfig,
    ScopeId,
    StoreId {
  checkedUsersStore: ICheckedUsersStore;
  onNextClick: () => void;
  onOpenChecked: () => void;
  pagingParamsName: ParamsName;
}

const UsersPagination = <
  ParamsName extends UsersPaginationParamsNames
>({
  checkedUsersStore,
  onNextClick,
  onOpenChecked,
  pagingParamsName,
  enableSelectAll = true,
  selectableWithoutBirthday = true,
  siblingCount = 1,
  boundaryCount = 1,
  scopeId,
  storeId,
}: UsersPaginationProps<ParamsName>) => {
  //using callback to avoid recreation of store each mount
  const fetchStore = useVkApiFetchStoreCallback(pagingParamsName);
  const usersStore = useLocalCachedStore(
    scopeId,
    storeId,
    UsersPaginationStore,
    checkedUsersStore,
    fetchStore,
    pagingParamsName
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
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
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
