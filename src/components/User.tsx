import { Avatar, SimpleCell } from "@vkontakte/vkui";
import { UserModel } from "../network/models/User/UserModel";
import Birthday from "./Birthday";

type UserProps = {
  user: UserModel;
};

const getPhotoUrl = (user: UserModel) => user.photo200;

const User = ({ user }: UserProps) => {
  const birthday = user.birthday;
  return (
    <SimpleCell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={<Birthday birthDate={birthday}/>}
    >
      {user.firstName} {user.lastName}
    </SimpleCell>
  );
};

export default User;
