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
import RemovableUser from "../components/User/RemovableUser";
import useLocalStore from "../hooks/useLocalStore";
import { UserID } from "../network/models/User/BaseUserModel";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import SelectedUsersStore from "../stores/SelectedUsersStore";
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
  const selectedUsersStore = useLocalStore(
    SelectedUsersStore,
    checkedUsersStore
  );

  const selectedUsersItems =
    selectedUsersStore.filteredSelectedUsers.map((user) => (
      <RemovableUser
        key={user.id}
        user={user}
        onRemoveUser={onUserRemove}
        showBirthday
      />
    ));

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
          value={selectedUsersStore.searchText}
          onChange={selectedUsersStore.onSearchTextChange}
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
        {selectedUsersStore.filteredSelectedUsers.length ? (
          <List>{selectedUsersItems}</List>
        ) : (
          <Footer>Ничего не выбрано</Footer>
        )}
      </Group>
    </Panel>
  );
};

export default observer(SelectedUsers);
