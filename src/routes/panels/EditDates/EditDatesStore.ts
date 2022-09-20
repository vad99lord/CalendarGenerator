import { UserModel } from "@network/models/User/UserModel";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { Disposable } from "@utils/types";
import { filterValues } from "@utils/utils";
import { action, computed, makeObservable, observable } from "mobx";

export default class EditDatesStore implements Disposable {
  private readonly _checkedUsersStore: ICheckedUsersStore;

  initialUsersWithoutBirthday: UserModel[] = [];

  constructor(checkedUsersStore: ICheckedUsersStore) {
    this._checkedUsersStore = checkedUsersStore;
    makeObservable<EditDatesStore, "_setInitialUsersWithoutBirthday">(
      this,
      {
        initialUsersWithoutBirthday: observable,
        _setInitialUsersWithoutBirthday: action.bound,
        currentUsers: computed,
        currentUsersWithBirthday: computed,
        currentUsersWithoutBirthday: computed,
        allDatesProvided: computed,
        onRemoveAllCurrentUsers: action.bound,
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

  get currentUsers() {
    return this.initialUsersWithoutBirthday
      .map((user) => {
        return this._checkedUsersStore.checked.get(user.id);
      })
      .filter(Boolean) as UserModel[];
  }

  get currentUsersWithoutBirthday() {
    return this.currentUsers.filter(
      (user) => !Boolean(user.birthday)
    );
  }

  get currentUsersWithBirthday() {
    return this.currentUsers.filter((user) => Boolean(user.birthday));
  }

  onRemoveAllCurrentUsers() {
    this._checkedUsersStore.setCheckedMany(false, this.currentUsers);
  }

  get allDatesProvided() {
    return (
      this.currentUsersWithBirthday.length ===
      this.currentUsers.length
    );
  }

  private _setInitialUsersWithoutBirthday() {
    this.initialUsersWithoutBirthday =
      this._getUsersWithoutBirthday();
  }

  destroy() {}
}
