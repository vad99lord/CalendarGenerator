import { Avatar, Cell } from "@vkontakte/vkui";
import { useEffect, useMemo } from "react";
import useCheckBoxState from "../hooks/useCheckBoxState";
import { UserModel } from "../network/models/User/UserModel";
import Birthday from "./Birthday";

export type UserProps = {
  user: UserModel;
  forceChecked?: boolean;
  ignoreDisabled?: boolean;
};

const getPhotoUrl = (user: UserModel) => user.photo200;

const isUserSelectionEnabled = (user: UserModel) =>
  Boolean(!user.deactivated && user.birthday);

const User = ({
  user,
  forceChecked = false,
  ignoreDisabled = false,
}: UserProps) => {
  const birthday = user.birthday;

  const isSelectionEnabled = useMemo(
    () => isUserSelectionEnabled(user)
  ,[user]);

  const {
    isChecked,
    isCheckable,
    onCheckChanged,
    setIsIgnoreEnabled,
    setIsChecked,
  } = useCheckBoxState({
    defaultChecked: forceChecked,
    defaultEnabled: isSelectionEnabled,
    defaultIgnoreEnabled: ignoreDisabled,
  });

  //update cbState only on props change
  useEffect(() => {
    setIsIgnoreEnabled(ignoreDisabled);
  }, [ignoreDisabled, setIsIgnoreEnabled]);
  useEffect(() => {
    setIsChecked(forceChecked);
  }, [forceChecked, setIsChecked]);

  return (
    <Cell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={<Birthday birthDate={birthday} />}
      mode="selectable"
      disabled={!isCheckable}
      checked={isChecked}
      onChange={onCheckChanged}
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default User;
