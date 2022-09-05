import { action, computed, makeObservable } from "mobx";
import { ChangeEvent } from "react";
import { Disposable } from "../utils/types";
import { filterValues } from "../utils/utils";
import CheckedUsersStore from "./CheckedUsersStore";
import SearchStore from "./SearchStore";

export default class SelectedUsersStore implements Disposable {
  private readonly _checkedUsers: CheckedUsersStore;
  private readonly _searchStore: SearchStore;

  constructor(checkedUsers: CheckedUsersStore) {
    this._checkedUsers = checkedUsers;
    this._searchStore = new SearchStore();
    makeObservable(this, {
      searchText: computed,
      onSearchTextChange: action.bound,
      filteredSelectedUsers: computed,
    });
  }

  get filteredSelectedUsers() {
    return filterValues(
      this._checkedUsers.checked,
      ({ firstName, lastName }) =>
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
