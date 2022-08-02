import { Avatar, Cell, CellProps } from "@vkontakte/vkui";
import {
  getAvatarUrl,
  getFullName,
  UserModel,
} from "../../network/models/User/UserModel";
import Birthday from "../Birthday/Birthday";

export interface BaseUserProps
  extends Omit<CellProps, "description" | "before" | "children"> {
  user: UserModel;
  getPhotoUrl?: (user: UserModel) => string;
  showBirthday?: boolean;
}

const BaseUser = ({
  user,
  getPhotoUrl = getAvatarUrl,
  showBirthday = false,
  ...props
}: BaseUserProps) => {
  const birthday = user.birthday;
  const description = showBirthday ? (
    <Birthday birthDate={birthday} />
  ) : undefined;
  const fullName = getFullName(user);

  return (
    <Cell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      description={description}
      {...props}
    >
      {fullName}
    </Cell>
  );
};

export default BaseUser;
