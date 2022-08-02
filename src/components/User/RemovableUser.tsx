import { memo, useCallback } from "react";
import { UserID } from "../../network/models/User/BaseUserModel";
import BaseUser, { BaseUserProps } from "./BaseUser";

export interface RemovableUserProps
  extends Omit<BaseUserProps, "onRemove" | "mode"> {
  onRemoveUser?: (id: UserID) => void;
}

const RemovableUser = ({
  user,
  onRemoveUser,
  ...props
}: RemovableUserProps) => {
  const onRemove = useCallback(() => {
    onRemoveUser?.(user.id);
  }, [onRemoveUser, user]);
  return (
    <BaseUser
      mode="removable"
      onRemove={onRemove}
      user={user}
      {...props}
    />
  );
};

export default memo(RemovableUser);
