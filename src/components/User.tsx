import { UsersUserFull } from "@vkontakte/api-schema-typescript";
import { Div } from "@vkontakte/vkui";

type UserProps = {
  user: UsersUserFull;
};

const User = ({ user }: UserProps) => {
  return (
    <Div>
      {user.first_name}, {user.last_name}
    </Div>
  );
};

export default User;
