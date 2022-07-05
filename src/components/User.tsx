import { Avatar, Cell } from "@vkontakte/vkui";
import { useState } from "react";
import { UserModel } from "../network/models/User/UserModel";
import Birthday from "./Birthday";

type UserProps = {
  user: UserModel;
};

const getPhotoUrl = (user: UserModel) => user.photo200;

const isUserSelectionEnabled = (user: UserModel) =>
  Boolean(!user.deactivated && user.birthday);

const User = ({ user }: UserProps) => {
  const birthday = user.birthday;
  const isSelectionEnabled = isUserSelectionEnabled(user);
  const [isChecked, setIsChecked] = useState(isSelectionEnabled);
  const onCheckChanged = () => {
    setIsChecked(!isChecked);
  };
  return (
    <Cell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={<Birthday birthDate={birthday} />}
      mode="selectable"
      disabled={!isSelectionEnabled}
      checked={isChecked}
      onChange={onCheckChanged}
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default User;
