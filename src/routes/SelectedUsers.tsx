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
import { useMemo } from "react";
import RemovableUser from "../components/RemovableUser";
import useSearchState from "../hooks/useSearchState";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";

type SelectedUsersProps = {
  id: string;
  selectedUsers: UserModel[];
  onUserRemove: (userId: UserID) => void;
  onAllUsersRemove: () => void;
  onBackClick: () => void;
};

const SelectedUsers = ({
  selectedUsers,
  id: panelId,
  onUserRemove,
  onAllUsersRemove,
  onBackClick,
}: SelectedUsersProps) => {
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();
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
        <RemovableUser user={user} onRemoveUser={onUserRemove} />
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

export default SelectedUsers;
