import RemovableUser from "@components/User/RemovableUser";
import useLocalStore from "@hooks/useLocalStore";
import { UserID } from "@network/models/User/BaseUserModel";
import { PaginationConfig } from "@routes/tabs/UsersPickerTab/UsersPickerTab";
import { NavElementId } from "@routes/types/navProps";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { LoadState } from "@stores/LoadState";
import {
  Button,
  Div,
  Footer,
  Group,
  Headline,
  List,
  Pagination,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Search,
  Spinner,
  Text,
  Title,
} from "@vkontakte/vkui";
import { when } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import SelectedUsersStore from "./SelectedUsersStore";

interface SelectedUsersProps extends NavElementId, PaginationConfig {
  checkedUsersStore: ICheckedUsersStore;
  onUserRemove: (userId: UserID) => void;
  onAllUsersRemove: () => void;
  onBackClick: () => void;
}

const SelectedUsers = ({
  checkedUsersStore,
  nav: panelId,
  onUserRemove,
  onAllUsersRemove,
  onBackClick,
  siblingCount,
  boundaryCount,
}: SelectedUsersProps) => {
  console.log("SelectedUsers render");
  const selectedUsersStore = useLocalStore(
    SelectedUsersStore,
    checkedUsersStore
  );

  const selectedUsersItems = selectedUsersStore.users.map((user) => (
    <RemovableUser
      key={user.id}
      user={user}
      onRemoveUser={onUserRemove}
      showBirthday
    />
  ));

  useEffect(() => {
    return when(
      () => checkedUsersStore.checkedCount === 0,
      () => onBackClick()
    );
  }, [onBackClick, checkedUsersStore]);

  const getContent = useCallback(() => {
    switch (selectedUsersStore.loadState) {
      case LoadState.Loading: {
        return <Spinner size="large" />;
      }
      case LoadState.Error: {
        return (
          <Div>
            <Title level="3">Произошла ошибка(</Title>
            <Headline level="2">{selectedUsersStore.error}</Headline>
            {/* <Button onClick={selectedUsersStore.refresh}>
              Попробовать еще раз
            </Button> */}
          </Div>
        );
      }
      default: {
        return selectedUsersItems.length ? (
          <List>{selectedUsersItems}</List>
        ) : (
          <Footer>Ничего не найдено</Footer>
        );
      }
    }
  }, [selectedUsersItems, selectedUsersStore]);

  const getPagination = useCallback(() => {
    const isDisabled =
      selectedUsersStore.loadState === LoadState.Loading;
    // no pagination needed if 1 or less pages
    if (selectedUsersStore.totalPagesCount < 2) return null;
    switch (selectedUsersStore.loadState) {
      case LoadState.Loading:
      case LoadState.Success:
      case LoadState.Error: {
        return (
          <Pagination
            style={{ marginBottom: 60 }}
            currentPage={selectedUsersStore.currentPage}
            onChange={selectedUsersStore.setCurrentPage}
            siblingCount={siblingCount}
            boundaryCount={boundaryCount}
            totalPages={selectedUsersStore.totalPagesCount}
            disabled={isDisabled}
          />
        );
      }
      default: {
        return null;
      }
    }
  }, [boundaryCount, siblingCount, selectedUsersStore]);

  return (
    <Panel id={panelId}>
      <PanelHeader
        separator={false}
        before={<PanelHeaderBack onClick={onBackClick} />}
      >
        Выбранные пользователи
      </PanelHeader>
      <Group>
        <Observer>
          {() => (
            <Search
              value={selectedUsersStore.query}
              onChange={selectedUsersStore.onSearchTextChange}
              after={null}
            />
          )}
        </Observer>
        <Div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Text>
            Выбрано пользователей: {checkedUsersStore.checkedCount}
          </Text>
          <Button
            size="m"
            appearance="negative"
            onClick={onAllUsersRemove}
          >
            Очистить все
          </Button>
        </Div>
        {/* {selectedUsersStore.filteredSelectedUsers.length ? (
          <List>{selectedUsersItems}</List>
        ) : (
          <Footer>Ничего не выбрано</Footer>
        )} */}
        {getContent()}
        {getPagination()}
      </Group>
    </Panel>
  );
};

export default observer(SelectedUsers);
