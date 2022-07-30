import { Avatar, Cell } from "@vkontakte/vkui";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import { getPhotoUrl } from "./User";

import { memo, useCallback } from "react";

type RemovableUserProps = {
  user: UserModel;
  onRemoveUser: (id: UserID) => void;
};

const RemovableUser = ({
  user,
  onRemoveUser,
}: RemovableUserProps) => {
  const onRemove = useCallback(() => {
    onRemoveUser(user.id);
  }, [onRemoveUser, user]);
  return (
    <Cell
      key={user.id}
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      mode="removable"
      onRemove={onRemove}
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default memo(RemovableUser);
