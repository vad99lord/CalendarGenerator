import { action, computed, makeObservable, observable } from "mobx";
import { UserID } from "../../network/models/User/BaseUserModel";
import { UserModel } from "../../network/models/User/UserModel";
import { Disposable } from "../../utils/types";

export default class CheckedUsersStore implements Disposable {
  private readonly _checked = new Map<UserID, UserModel>();

  constructor() {
    makeObservable<CheckedUsersStore, "_checked">(this, {
      _checked: observable,
      checked: computed,
      uncheck: action.bound,
      uncheckMany: action.bound,
      check: action.bound,
      checkMany: action.bound,
      setChecked: action.bound,
      setCheckedMany: action.bound,
      toggleCheck: action.bound,
      clear: action.bound,
    });
  }

  destroy() {}

  get checked(): ReadonlyMap<UserID, UserModel> {
    return this._checked;
  }

  get checkedCount() {
    return this._checked.size;
  }

  uncheck(id: UserID) {
    this._checked.delete(id);
  }

  uncheckMany(ids: UserID[]) {
    ids.forEach((id) => this._checked.delete(id));
  }

  check(user: UserModel) {
    this._checked.set(user.id, user);
  }

  checkMany(users: UserModel[]) {
    users.forEach((user) => this.check(user));
  }

  setChecked(isChecked: boolean, user: UserModel) {
    isChecked ? this.check(user) : this.uncheck(user.id);
  }

  setCheckedMany(isChecked: boolean, users: UserModel[]) {
    users.forEach((user) => this.setChecked(isChecked, user));
  }

  toggleCheck(user: UserModel) {
    if (this._checked.has(user.id)) {
      this._checked.delete(user.id);
    } else {
      this._checked.set(user.id, user);
    }
  }

  clear() {
    this._checked.clear();
  }
}
