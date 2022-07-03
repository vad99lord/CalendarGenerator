import { UsersUserFull } from "@vkontakte/api-schema-typescript";
import { Mapper } from "../../types/Mappers";
import { BirthDate } from "../Birthday/Birthday";
import { DEFAULT_USER_PHOTOS, UserModel } from "./UserModel";

const userApiToUser: Mapper<UsersUserFull, UserModel> = (user) => {
  const t: UserModel = {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    canAccessClosed: user.can_access_closed,
    deactivated: user.deactivated,
    birthday: user.bdate ? new BirthDate(user.bdate) : undefined,
    photo100: user.photo_100 ?? DEFAULT_USER_PHOTOS["photo100"],
    photo200: user.photo_200 ?? DEFAULT_USER_PHOTOS["photo200"],
    photoMax: user.photo_max ?? DEFAULT_USER_PHOTOS["photoMax"],
  };
  return t;
};

export default userApiToUser;
