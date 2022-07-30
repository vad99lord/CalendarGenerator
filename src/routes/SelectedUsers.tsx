import {
  Group,
  List,
  Panel,
  PanelHeader,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import { useMemo } from "react";
import RemovableUser from "../components/RemovableUser";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";

type SelectedFriendsProps = {
  id: string;
  selectedUsers: UserModel[];
  onUserRemove: (userId: UserID) => void;
  onBackClick: () => void;
};

const SelectedUsers = ({
  selectedUsers,
  id: panelId,
  onUserRemove,
  onBackClick,
}: SelectedFriendsProps) => {
  const selectedUsersItems = useMemo(
    () =>
      selectedUsers.map((user) => (
        <RemovableUser user={user} onRemoveUser={onUserRemove} />
      )),
    [onUserRemove, selectedUsers]
  );

  return (
    <Panel id={panelId}>
      <PanelHeader before={<PanelHeaderBack onClick={onBackClick} />}>
        Выбранные пользователи
      </PanelHeader>
      <Group>
        <List>{selectedUsersItems}</List>
      </Group>
    </Panel>
  );
};

export default SelectedUsers;
