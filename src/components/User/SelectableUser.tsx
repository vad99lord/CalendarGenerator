import { memo, useCallback } from "react";
import { UserModel } from "../../network/models/User/UserModel";
import BaseUser, { BaseUserProps } from "./BaseUser";

export interface SelectableUserProps
  extends Omit<
    BaseUserProps,
    "defaultChecked" | "onChange" | "mode"
  > {
  onUserCheckChanged?: (user: UserModel) => void;
}

const SelectableUser = ({
  user,
  onUserCheckChanged,
  ...props
}: SelectableUserProps) => {
  const onCheckChanged = useCallback(() => {
    if (!onUserCheckChanged) return;
    onUserCheckChanged(user);
  }, [onUserCheckChanged, user]);

  return (
    <BaseUser
      mode="selectable"
      onChange={onCheckChanged}
      user={user}
      {...props}
    />
  );
};

export default memo(SelectableUser);
