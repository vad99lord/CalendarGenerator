import { action, computed, makeObservable } from "mobx";
import { ChangeEvent } from "react";
import { Disposable } from "../utils/types";
import CheckedUsersStore from "./CheckedUsersStore";
import SearchStore from "./SearchStore";

export default class SelectedUsersStore implements Disposable {
  private _checkedUsers: CheckedUsersStore;
  private _searchStore: SearchStore;

  constructor(checkedUsers: CheckedUsersStore) {
    this._checkedUsers = checkedUsers;
    this._searchStore = new SearchStore();
    makeObservable<SelectedUsersStore, "_selectedUsers">(this, {
      searchText: computed,
      onSearchTextChange: action.bound,
      _selectedUsers: computed,
      filteredSelectedUsers: computed,
    });
  }

  get _selectedUsers() {
    return Array.from(this._checkedUsers.checked.values());
  }

  get filteredSelectedUsers() {
    return this._selectedUsers.filter(({ firstName, lastName }) =>
      `${firstName} ${lastName}`
        .toLocaleLowerCase()
        .includes(
          this._searchStore.debouncedSearchText.toLocaleLowerCase()
        )
    );
  }

  get searchText() {
    return this._searchStore.searchText;
  }

  onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    this._searchStore.onSearchTextChange(e);
  }

  destroy() {
    this._searchStore.destroy();
  }
}
