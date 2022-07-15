import { Avatar, Cell } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { UserModel } from "../network/models/User/UserModel";
import Birthday from "./Birthday";

export type UserProps = {
  user: UserModel;
  disabled: boolean;
  checked: boolean;
  onUserCheckChanged?: (user: UserModel) => void;
};

const getPhotoUrl = (user: UserModel) => user.photo200;

export const isUserSelectionEnabled = (user: UserModel) =>
  Boolean(!user.deactivated && user.birthday);

const User = ({
  user,
  checked,
  disabled,
  onUserCheckChanged,
}: UserProps) => {
  const birthday = user.birthday;

  const onCheckChanged = useCallback(() => {
    if (!onUserCheckChanged) return;
    onUserCheckChanged(user);
  }, [onUserCheckChanged, user]);

  return (
    <Cell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={<Birthday birthDate={birthday} />}
      mode="selectable"
      disabled={disabled}
      checked={checked}
      onChange={onCheckChanged}
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default memo(User);
