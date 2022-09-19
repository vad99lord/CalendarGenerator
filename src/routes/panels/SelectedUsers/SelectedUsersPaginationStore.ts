import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import {
  PaginationParams,
  SearchParams,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { EmptyOuterFetchParamsProvider } from "@stores/PaginationStore/PaginationOuterFetchParams";
import PaginationStore, {
  PaginationConfig,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import { isEmptyArray } from "@utils/utils";
import {
  action,
  IReactionDisposer,
  makeObservable,
  reaction,
  toJS,
} from "mobx";
import SelectedUsersFetchStore from "./SelectedUsersFetchStore";

export type UsersSearchParams = SearchParams;
export type FetchParams = PaginationParams;
export type ErrorData = string;

export default class SelectedUsersPaginationStore {
  private _selectedUsersPaginationReaction: IReactionDisposer;
  private _previousPage?: number;
  private _selectedUsersFetchStore: SelectedUsersFetchStore;
  _selectedUsersPaginationStore;
  private _selectedUsersPaginationLoadReaction: IReactionDisposer;
  private _debouncedSearchPaginationReaction: IReactionDisposer;

  constructor(
    checkedUsers: ICheckedUsersStore,
    searchStore: ISearchStore,
    config?: PaginationConfig
  ) {
    this._selectedUsersFetchStore = new SelectedUsersFetchStore(
      checkedUsers,
      searchStore
    );
    this._selectedUsersPaginationStore = new PaginationStore(
      this._selectedUsersFetchStore,
      EmptyOuterFetchParamsProvider,
      config
    );
    makeObservable<
      SelectedUsersPaginationStore,
      "_restorePreviousPage" | "_setPreviousPage"
    >(this, {
      _restorePreviousPage: action.bound,
      _setPreviousPage: action.bound,
    });
    this._selectedUsersPaginationReaction = reaction(
      () => checkedUsers.checkedCount,
      () => {
        this._setPreviousPage(
          this._selectedUsersPaginationStore.currentPage
        );
        this._selectedUsersPaginationStore.refresh();
      }
    );
    this._selectedUsersPaginationLoadReaction = reaction(
      () => this._selectedUsersPaginationStore.pageItems,
      (pageItems) => {
        console.log(
          "_selectedUsersPaginationLoadReaction",
          toJS(pageItems),
          this._previousPage
        );
        if (!isEmptyArray(pageItems)) {
          this._restorePreviousPage();
        }
      }
    );
    this._debouncedSearchPaginationReaction = reaction(
      () => searchStore.debouncedSearchText,
      () => {
        this._selectedUsersPaginationStore.refresh();
      }
    );
  }

  private _setPreviousPage(previousPage?: number) {
    this._previousPage = previousPage;
  }

  private _restorePreviousPage() {
    if (this._previousPage === undefined) return;
    const previousPage = Math.min(
      this._previousPage,
      this._selectedUsersPaginationStore.pagesCount
    );
    this._selectedUsersPaginationStore.setCurrentPage(previousPage);
    this._setPreviousPage(undefined);
  }

  destroy() {
    this._selectedUsersPaginationReaction();
    this._selectedUsersPaginationLoadReaction();
    this._debouncedSearchPaginationReaction();
    this._selectedUsersFetchStore.destroy();
    this._selectedUsersPaginationStore.destroy();
  }
}
