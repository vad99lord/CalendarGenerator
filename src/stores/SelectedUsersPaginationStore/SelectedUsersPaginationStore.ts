import { UserModel } from "@network/models/User/UserModel";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import {
  PaginationParams,
  SearchParams,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { IPaginationStore } from "@stores/PaginationStore/IPaginationStore";
import { EmptyOuterFetchParamsProvider } from "@stores/PaginationStore/PaginationOuterFetchParams";
import PaginationStore, {
  PaginationConfig,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import { Disposable } from "@utils/types";
import { isEmptyArray } from "@utils/utils";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  reaction,
  toJS,
} from "mobx";
import SelectedUsersFetchStore, {
  ISelectedUsersFetchStore,
} from "./SelectedUsersFetchStore";

export type UsersSearchParams = SearchParams;
export type FetchParams = PaginationParams;
export type ErrorData = string;

export type ISelectedUsersPaginationStore = IPaginationStore<
  UserModel,
  ErrorData
>;

export default class SelectedUsersPaginationStore
  implements IPaginationStore<UserModel, ErrorData>, Disposable
{
  private _selectedUsersPaginationReaction: IReactionDisposer;
  private _previousPage?: number;
  private _selectedUsersFetchStore: ISelectedUsersFetchStore &
    Disposable;
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
      pagesCount: computed,
      pageItems: computed,
      currentPage: computed,
      loadState: computed,
      error: computed,
      setCurrentPage: action.bound,
      refresh: action.bound,
      retry: action.bound,
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

  get pagesCount() {
    return this._selectedUsersPaginationStore.pagesCount;
  }

  get pageItems() {
    return this._selectedUsersPaginationStore.pageItems;
  }

  get currentPage() {
    return this._selectedUsersPaginationStore.currentPage;
  }

  get loadState() {
    return this._selectedUsersPaginationStore.loadState;
  }

  get error() {
    return this._selectedUsersPaginationStore.error;
  }

  setCurrentPage(page: number): void {
    return this._selectedUsersPaginationStore.setCurrentPage(page);
  }

  refresh(): void {
    return this._selectedUsersPaginationStore.refresh();
  }

  retry(): void {
    return this._selectedUsersPaginationStore.retry();
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
