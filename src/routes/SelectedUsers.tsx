import {
  Button,
  Div,
  Footer,
  Group,
  List,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Search,
} from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import RemovableUser from "../components/User/RemovableUser";
import useSearchState from "../hooks/useSearchState";
import { UserID } from "../network/models/User/BaseUserModel";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import { NavElementId } from "./ChooseUsers";

interface SelectedUsersProps extends NavElementId {
  checkedUsersStore: CheckedUsersStore;
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
}: SelectedUsersProps) => {
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();
  const selectedUsers = Array.from(checkedUsersStore.checked.values())
  console.log(selectedUsers);
  const filteredSelectedUsers = useMemo(
    () =>
      selectedUsers.filter(({ firstName, lastName }) =>
        `${firstName} ${lastName}`
          .toLocaleLowerCase()
          .includes(debouncedSearchText.toLocaleLowerCase())
      ),
    [debouncedSearchText, selectedUsers]
  );

  const selectedUsersItems = useMemo(
    () =>
      filteredSelectedUsers.map((user) => (
        <RemovableUser
          key={user.id}
          user={user}
          onRemoveUser={onUserRemove}
          showBirthday
        />
      )),
    [onUserRemove, filteredSelectedUsers]
  );

  return (
    <Panel id={panelId}>
      <PanelHeader
        separator={false}
        before={<PanelHeaderBack onClick={onBackClick} />}
      >
        Выбранные пользователи
      </PanelHeader>
      <Group>
        <Search
          value={searchText}
          onChange={onSearchChange}
          after={null}
        />
        <Div style={{ display: "flex", justifyContent: "end" }}>
          <Button
            size="m"
            appearance="negative"
            onClick={onAllUsersRemove}
          >
            Очистить все
          </Button>
        </Div>
        {filteredSelectedUsers.length ? (
          <List>{selectedUsersItems}</List>
        ) : (
          <Footer>Ничего не выбрано</Footer>
        )}
      </Group>
    </Panel>
  );
};

export default observer(SelectedUsers);
