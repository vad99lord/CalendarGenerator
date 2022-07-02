import { Avatar, SimpleCell } from "@vkontakte/vkui";
import { UserModel } from "../network/models/User/UserModel";

type UserProps = {
  user: UserModel;
};

const getPhotoUrl = (user: UserModel) => user.photo200;

const User = ({ user }: UserProps) => {
  return (
    <SimpleCell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={user.bdate}
    >
      {user.firstName} {user.lastName}
    </SimpleCell>
  );
};

export default User;
