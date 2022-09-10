import userApiToUser from "@network/models/User/userApiToUser";
import { isUserSelectable } from "@network/models/User/UserModel";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { IVkApiFetchStore } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import { VkApiMethodParamsNames } from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { PaginationOuterFetchParamsProvider } from "@stores/PaginationStore/PaginationOuterFetchParams";
import PaginationStore, {
  IPaginationStore,
  PaginationConfig,
  PaginationItem,
  PaginationOuterFetchParams,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import { Disposable, UnionToIntersection } from "@utils/types";
import { action, computed, makeObservable, observable } from "mobx";
import { ChangeEvent } from "react";

export type UsersPaginationParamsNames = Extract<
  VkApiMethodParamsNames,
  "PaginateFriendsByQuery" | "PaginateUsersByQuery"
>;

type PaginationStoresUnion = UnionToIntersection<
  IVkApiFetchStore<UsersPaginationParamsNames>
>;

const createQueryParamsProvider = (
  searchStore: ISearchStore
): PaginationOuterFetchParamsProvider<
  PaginationOuterFetchParams<PaginationStoresUnion>
> => {
  return {
    getOuterFetchParams() {
      return {
        query: searchStore.debouncedSearchText,
      };
    },
  };
};

const USER_PAGINATION_CONFIG: Record<
  UsersPaginationParamsNames,
  PaginationConfig
> = {
  PaginateFriendsByQuery: {
    loadSize: 30,
    initialLoadSize: 40,
    itemsPerPage: 10,
  },
  PaginateUsersByQuery: {
    loadSize: 40,
    initialLoadSize: 100,
    itemsPerPage: 10,
  },
};

type _UsersPaginationStore = IPaginationStore<
  PaginationItem<PaginationStoresUnion>
>;

export default class UsersPaginationStore<
  ParamsNames extends UsersPaginationParamsNames
> implements Disposable
{
  private readonly _usersPaginationStore: _UsersPaginationStore;
  private readonly _searchStore: ISearchStore;
  private readonly _checkedUsers: ICheckedUsersStore;
  ignoreSelectable = false;

  constructor(
    checkedUsers: ICheckedUsersStore,
    usersFetchStore: IVkApiFetchStore<ParamsNames>,
    pagingParamsName: ParamsNames
  ) {
    this._searchStore = new SearchStore({
      initialText: "",
    });
    this._checkedUsers = checkedUsers;
    this._usersPaginationStore = new PaginationStore(
      usersFetchStore as PaginationStoresUnion,
      createQueryParamsProvider(this._searchStore),
      USER_PAGINATION_CONFIG[pagingParamsName]
    );
    makeObservable(this, {
      loadState: computed,
      users: computed,
      setCurrentPage: action.bound,
      totalPagesCount: computed,
      query: computed,
      onSearchTextChange: action.bound,
      ignoreSelectable: observable,
      toggleIgnoreSelectable: action.bound,
      selectableUsers: computed,
      enabledUsers: computed,
      disabledUsers: computed,
      areAllUsersChecked: computed,
      onSelectAllChanged: action.bound,
    });
  }

  get users() {
    return this._usersPaginationStore.pageItems.map(userApiToUser);
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

  get query() {
    return this._searchStore.searchText;
  }

  onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    this._searchStore.onSearchTextChange(e);
  }

  toggleIgnoreSelectable() {
    this.ignoreSelectable = !this.ignoreSelectable;
    if (!this.ignoreSelectable && this.disabledUsers.length > 0) {
      this._checkedUsers.setCheckedMany(false, this.disabledUsers);
    }
  }

  get selectableUsers() {
    return this.users.map((user) => ({
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

  onSelectAllChanged() {
    if (!this.areAllUsersChecked) {
      this._checkedUsers.setCheckedMany(true, this.enabledUsers);
    } else {
      this._checkedUsers.setCheckedMany(false, this.enabledUsers);
    }
  }

  destroy() {
    this._searchStore.destroy();
    this._usersPaginationStore.destroy();
  }
}
