import BottomButton from "@components/BottomButton/BottomButton";
import TourTooltip from "@components/TourTooltip/TourTooltip";
import SelectableUser from "@components/User/SelectableUser";
import { TooltipContext } from "@contexts/TooltipContext";
import { useLateInitContext } from "@hooks/useLateInitContext";
import useLocalCachedStore from "@hooks/useLocalCachedStore";
import { useVkApiFetchStoreCallback } from "@hooks/useVkApiFetchStore";
import { vkBridgeErrorToString } from "@network/vk/VkErrorLogger";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { LoadState } from "@stores/LoadState";
import {
  Button,
  Checkbox,
  Counter,
  Div,
  Footer,
  FormItem,
  Group,
  Headline,
  List,
  Pagination,
  PaginationProps,
  Search,
  SimpleCell,
  SizeType,
  Spinner,
  Switch,
  Title,
} from "@vkontakte/vkui";
import { Observer, observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import { ScopeId, StoreId } from "../../types/navProps";
import UsersPickerTabStore, {
  UsersPaginationParamsNames,
} from "./UsersPickerTabStore";

export type UsersPickerConfig = {
  enableSelectAll?: boolean;
  selectableWithoutBirthday?: boolean;
};

export type UsersPickerTabOuterProps = Pick<
  UsersPickerTabProps<any>,
  "onNextClick" | "onOpenChecked" | "checkedUsersStore"
> &
  ScopeId;

export interface PaginationConfig
  extends Pick<PaginationProps, "siblingCount" | "boundaryCount"> {}

export interface UsersPickerTabProps<
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

const UsersPickerTab = <
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
}: UsersPickerTabProps<ParamsName>) => {
  //using callback to avoid recreation of store each mount
  const fetchStore = useVkApiFetchStoreCallback(pagingParamsName);
  const usersStore = useLocalCachedStore(
    scopeId,
    storeId,
    UsersPickerTabStore,
    checkedUsersStore,
    fetchStore,
    pagingParamsName
  );
  const tooltipTour = useLateInitContext(TooltipContext);
  useEffect(() => {
    tooltipTour.start();
  }, [tooltipTour]);
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

  const getContent = useCallback(() => {
    switch (usersStore.loadState) {
      case LoadState.Loading: {
        return <Spinner size="large" />;
      }
      case LoadState.Error: {
        return (
          <Div>
            <Title level="3">Произошла ошибка(</Title>
            <Headline level="2">
              {vkBridgeErrorToString(usersStore.error)}
            </Headline>
            <Button onClick={usersStore.retry}>
              Попробовать еще раз
            </Button>
          </Div>
        );
      }
      default: {
        return userItems.length ? (
          <List>{userItems}</List>
        ) : (
          <Footer>Ничего не найдено</Footer>
        );
      }
    }
  }, [userItems, usersStore]);

  const getPagination = useCallback(() => {
    const isDisabled = usersStore.loadState === LoadState.Loading;
    // no pagination needed if 1 or less pages
    if (usersStore.totalPagesCount < 2) return null;
    switch (usersStore.loadState) {
      case LoadState.Loading:
      case LoadState.Success:
      case LoadState.Error: {
        return (
          <Pagination
            style={{ marginBottom: 60 }}
            currentPage={usersStore.currentPage}
            onChange={usersStore.setCurrentPage}
            siblingCount={siblingCount}
            boundaryCount={boundaryCount}
            totalPages={usersStore.totalPagesCount}
            disabled={isDisabled}
          />
        );
      }
      default: {
        return null;
      }
    }
  }, [boundaryCount, siblingCount, usersStore]);
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
            <TourTooltip stepId={1} text="test1">
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
            </TourTooltip>
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
                <TourTooltip stepId={2} text="test2">
                  <Switch
                    checked={usersStore.ignoreSelectable}
                    onChange={usersStore.toggleIgnoreSelectable}
                  />
                </TourTooltip>
              )}
            </Observer>
          }
        >
          Ручной выбор
        </SimpleCell>
      )}
      {getContent()}
      {getPagination()}
      <Observer>
        {() => (
          <TourTooltip stepId={3} text="test3">
            <BottomButton
              onClick={onNextClick}
              disabled={checkedUsersStore.checkedCount === 0}
            >
              Далее
            </BottomButton>
          </TourTooltip>
        )}
      </Observer>
    </Group>
  );
};

export default observer(UsersPickerTab);
