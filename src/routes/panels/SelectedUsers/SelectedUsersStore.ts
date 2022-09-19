import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import SelectedUsersPaginationStore, {
  ISelectedUsersPaginationStore,
} from "@stores/SelectedUsersPaginationStore/SelectedUsersPaginationStore";
import { Disposable } from "@utils/types";
import { action, computed, makeObservable } from "mobx";
import { ChangeEvent } from "react";

export const SELECTED_USERS_PAGINATION_CONFIG = {
  loadSize: 30,
  initialLoadSize: 30,
  itemsPerPage: 10,
};

export default class SelectedUsersStore implements Disposable {
  private readonly _checkedUsers: ICheckedUsersStore;
  private readonly _searchStore: ISearchStore & Disposable;
  private readonly _selectedUsersPaginationStore: ISelectedUsersPaginationStore &
    Disposable;

  constructor(checkedUsers: ICheckedUsersStore) {
    this._checkedUsers = checkedUsers;
    this._searchStore = new SearchStore();
    this._selectedUsersPaginationStore =
      new SelectedUsersPaginationStore(
        this._checkedUsers,
        this._searchStore,
        SELECTED_USERS_PAGINATION_CONFIG
      );
    makeObservable(this, {
      loadState: computed,
      users: computed,
      setCurrentPage: action.bound,
      totalPagesCount: computed,
      query: computed,
      onSearchTextChange: action.bound,
      error: computed,
      currentPage: computed,
    });
  }

  get users() {
    return this._selectedUsersPaginationStore.pageItems;
  }

  get loadState() {
    return this._selectedUsersPaginationStore.loadState;
  }

  get error() {
    return this._selectedUsersPaginationStore.error;
  }

  setCurrentPage(page: number) {
    this._selectedUsersPaginationStore.setCurrentPage(page);
  }

  get totalPagesCount() {
    return this._selectedUsersPaginationStore.pagesCount;
  }

  get currentPage() {
    return this._selectedUsersPaginationStore.currentPage;
  }

  get query() {
    return this._searchStore.searchText;
  }

  onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    this._searchStore.onSearchTextChange(e);
  }

  destroy() {
    this._searchStore.destroy();
    this._selectedUsersPaginationStore.destroy();
  }
}
