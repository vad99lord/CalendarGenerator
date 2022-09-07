import userApiToUser from "@network/models/User/userApiToUser";
import { IVkApiFetchStore } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import {
  SearchParams,
  VkApiMethodParamsNames,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import PaginationStore, {
  PaginationOuterFetchParamsProvider,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import { Disposable } from "@utils/types";
import { action, computed, makeObservable } from "mobx";
import { ChangeEvent } from "react";

export type UsersPaginateParamsNames = Extract<
  VkApiMethodParamsNames,
  "PaginateFriendsByQuery"
>;

function createQueryParamsProvider(
  searchStore: ISearchStore
): PaginationOuterFetchParamsProvider<SearchParams> {
  return {
    getOuterFetchParams() {
      return {
        query: searchStore.debouncedSearchText,
      };
    },
  };
}

export default class UsersPaginationStore
  implements Disposable
{
  private readonly _usersFetchStore;
  private readonly _usersPaginationStore;
  private readonly _searchStore: ISearchStore;

  constructor(
    friendsFetchStore: IVkApiFetchStore<UsersPaginateParamsNames>
  ) {
    this._usersFetchStore = friendsFetchStore;
    this._searchStore = new SearchStore({
      initialText: "",
    });
    this._usersPaginationStore = new PaginationStore(
      this._usersFetchStore,
      createQueryParamsProvider(this._searchStore)
    );
    makeObservable(this, {
      // fetch: action.bound,
      loadState: computed,
      users: computed,
      setCurrentPage: action.bound,
      totalPagesCount: computed,
      query: computed,
      onSearchTextChange: action.bound,
    });
  }

  get users() {
    return (
      this._usersPaginationStore.pageItems?.map(userApiToUser) ?? []
    );
  }

  get loadState() {
    return this._usersPaginationStore.loadState;
  }

  setCurrentPage(page: number) {
    this._usersPaginationStore.setCurrentPage(page);
  }

  get totalPagesCount() {
    return this._usersPaginationStore.pagesCount;
  }

  get currentPage() {
    return this._usersPaginationStore.currentPage;
  }

  // fetch(params: PaginationFetchParams) {
  //   this._usersPaginationStore.fetch(params);
  // }

  get query() {
    return this._searchStore.searchText;
  }

  onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    this._searchStore.onSearchTextChange(e);
  }

  destroy() {}
}
