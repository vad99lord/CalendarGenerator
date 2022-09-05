import RemovableUser from "@components/User/RemovableUser";
import useLocalStore from "@hooks/useLocalStore";
import CheckedUsersStore from "@stores/CheckedUsersStore/CheckedUsersStore";
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
import { Observer, observer } from "mobx-react-lite";
import { UserID } from "../../network/models/User/BaseUserModel";
import { NavElementId } from "../ChooseUsers/ChooseUsers";
import SelectedUsersStore from "./SelectedUsersStore";

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
        <Observer>
          {() => (
            <Search
              value={selectedUsersStore.searchText}
              onChange={selectedUsersStore.onSearchTextChange}
              after={null}
            />
          )}
        </Observer>
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
