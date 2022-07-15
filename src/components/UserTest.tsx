import { Avatar, Cell } from "@vkontakte/vkui";
import { memo, useCallback } from "react";
import { UserModel } from "../network/models/User/UserModel";

type Props = {
  user: UserModel;
  checked: boolean;
  onUserCheckChanged: (user: UserModel) => void;
};
const UserTest = ({ user, checked, onUserCheckChanged }: Props) => {
  const onCheckChanged = useCallback(() => {
    if (!onUserCheckChanged) return;
    onUserCheckChanged(user);
  }, [onUserCheckChanged, user]);
  // const [c,sc] = useSimpleCheckBoxState(false);
  return (
    <Cell
      before={<Avatar size={48} src={user.photo100} />}
      description="birthday"
      mode="selectable"
      checked={checked}
      onChange={onCheckChanged}
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default memo(UserTest);
