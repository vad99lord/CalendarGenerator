import { action, computed, makeObservable, observable } from "mobx";
import userApiToUser from "../network/models/User/userApiToUser";
import {
  isUserSelectable,
  UserModel,
} from "../network/models/User/UserModel";
import { Disposable } from "../utils/types";
import CheckedUsersStore from "./CheckedUsersStore";
import VkApiFetchStore from "./VkApiFetchStore";
import { VkApiQueryParams } from "./VkApiParamsProviderMap";

export default class UsersComponentStore implements Disposable {
  ignoreSelectable = false;
  private _checkedUsers: CheckedUsersStore;
  private _friendsFetchStore: VkApiFetchStore<"SearchFriendsByQuery">;

  constructor(
    checkedUsers: CheckedUsersStore,
    friendsFetchStore: VkApiFetchStore<"SearchFriendsByQuery">
  ) {
    this._checkedUsers = checkedUsers;
    this._friendsFetchStore = friendsFetchStore;
    makeObservable<UsersComponentStore>(this, {
      ignoreSelectable: observable,
      toggleIgnoreSelectable: action.bound,
      selectableUsers: computed,
      enabledUsers: computed,
      disabledUsers: computed,
      areAllUsersChecked: computed,
      fetch: action.bound,
      onSelectAllChanged: action.bound,
      friends: computed,
      loadState: computed,
    });
  }

  get friends(): UserModel[] {
    const { data } = this._friendsFetchStore;
    const modelFriends = data?.items.map(userApiToUser) ?? [];
    return modelFriends;
  }

  get loadState() {
    return this._friendsFetchStore.loadState;
  }

  fetch(params: VkApiQueryParams["SearchFriendsByQuery"]) {
    this._friendsFetchStore.fetch(params);
  }

  toggleIgnoreSelectable() {
    this.ignoreSelectable = !this.ignoreSelectable;
    if (!this.ignoreSelectable && this.disabledUsers.length > 0) {
      this._checkedUsers.setCheckedMany(false, this.disabledUsers);
    }
  }

  get selectableUsers() {
    return this.friends.map((user) => ({
      user,
      isSelectable: this.ignoreSelectable || isUserSelectable(user),
    }));
  }

  get enabledUsers() {
    return this.selectableUsers
      .filter((it) => it.isSelectable)
      .map(({ user }) => user);
  }

  get disabledUsers() {
    return this.selectableUsers
      .filter((it) => !it.isSelectable)
      .map(({ user }) => user);
  }

  get areAllUsersChecked() {
    return this.enabledUsers.every(({ id }) =>
      this._checkedUsers.checked.get(id)
    );
  }

  destroy() {}

  onSelectAllChanged() {
    if (!this.areAllUsersChecked) {
      this._checkedUsers.setCheckedMany(true, this.enabledUsers);
    } else {
      this._checkedUsers.setCheckedMany(false, this.enabledUsers);
    }
  }
}
