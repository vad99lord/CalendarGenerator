import { UserID } from "@network/models/User/BaseUserModel";
import { UserModel } from "@network/models/User/UserModel";

export default interface ICheckedUsersStore {
  checked: ReadonlyMap<UserID, UserModel>;
  checkedCount: number;
  uncheck(id: UserID): void;
  uncheckMany(ids: UserID[]): void;
  check(user: UserModel): void;
  checkMany(users: UserModel[]): void;
  setChecked(isChecked: boolean, user: UserModel): void;
  setCheckedMany(isChecked: boolean, users: UserModel[]): void;
  toggleCheck(user: UserModel): void;
  clear(): void;
}
