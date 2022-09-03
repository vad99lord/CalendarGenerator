import { action, computed, makeObservable, observable } from "mobx";
import { UserModel } from "../network/models/User/UserModel";
import { Disposable } from "../utils/types";
import { filterValues } from "../utils/utils";
import CheckedUsersStore from "./CheckedUsersStore";

export default class EditDatesStore implements Disposable {
  private _checkedUsersStore: CheckedUsersStore;

  initialUsersWithoutBirthday: UserModel[] = [];

  constructor(checkedUsersStore: CheckedUsersStore) {
    this._checkedUsersStore = checkedUsersStore;
    makeObservable<EditDatesStore, "_setInitialUsersWithoutBirthday">(
      this,
      {
        initialUsersWithoutBirthday: observable,
        _setInitialUsersWithoutBirthday: action.bound,
        currentUsersWithoutBirthday: computed,
        allDatesProvided: computed,
      }
    );
    this._setInitialUsersWithoutBirthday();
  }

  private _getUsersWithoutBirthday() {
    return filterValues(
      this._checkedUsersStore.checked,
      (user) => user.birthday === undefined
    );
  }

  get currentUsersWithoutBirthday() {
    return this.initialUsersWithoutBirthday
      .map((user) => {
        return this._checkedUsersStore.checked.get(user.id);
      })
      .filter(Boolean) as UserModel[];
  }

  get allDatesProvided() {
    return this.currentUsersWithoutBirthday.every((user) =>
      Boolean(user.birthday)
    );
  }

  private _setInitialUsersWithoutBirthday() {
    this.initialUsersWithoutBirthday =
      this._getUsersWithoutBirthday();
  }

  destroy() {}
}
