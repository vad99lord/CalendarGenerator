import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import { Disposable } from "@utils/types";
import { filterValues } from "@utils/utils";
import { action, computed, makeObservable } from "mobx";
import { ChangeEvent } from "react";

export default class SelectedUsersStore implements Disposable {
  private readonly _checkedUsers: ICheckedUsersStore;
  private readonly _searchStore: ISearchStore;

  constructor(checkedUsers: ICheckedUsersStore) {
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
