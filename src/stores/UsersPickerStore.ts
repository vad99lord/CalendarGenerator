import { computed, makeObservable } from "mobx";
import { UserModel } from "../network/models/User/UserModel";
import { Disposable } from "../utils/types";
import CheckedUsersStore from "./CheckedUsersStore";

export interface UsersWithoutBirthday {
  usersWithoutBirthday: UserModel[];
}

export default class UsersPickerStore
  implements Disposable, UsersWithoutBirthday
{
  private _checkedUsersStore: CheckedUsersStore;

  // usersWithoutBirthday: UserModel[] = [];

  constructor(checkedUsersStore: CheckedUsersStore) {
    this._checkedUsersStore = checkedUsersStore;
    makeObservable(this, {
      // usersWithoutBirthday: computed,
      usersWithoutBirthday: computed,
      // setUsersWithoutBirthday: action.bound,
    });
  }

  // setUsersWithoutBirthday() {
  //   const usersWithoutBirthday = Array.from(
  //     this._checkedUsersStore.checked.values()
  //   ).filter((user) => user.birthday === undefined);
  //   this.usersWithoutBirthday = usersWithoutBirthday;
  // }

  get usersWithoutBirthday() {
    const usersWithoutBirthday: UserModel[] = [];
    this._checkedUsersStore.checked.forEach((user) => {
      if (user.birthday === undefined) {
        usersWithoutBirthday.push(user);
      }
    });
    return usersWithoutBirthday;
  }

  destroy() {}
}
