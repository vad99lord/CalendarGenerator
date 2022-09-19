import userApiToUser from "@network/models/User/userApiToUser";
import { isUserSelectable } from "@network/models/User/UserModel";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { IFetchStoreParams } from "@stores/FetchStores/IFetchStore";
import { IVkApiFetchStore } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import { VkApiMethodParamsNames } from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { IPaginationStore } from "@stores/PaginationStore/IPaginationStore";
import { PaginationOuterFetchParamsProvider } from "@stores/PaginationStore/PaginationOuterFetchParams";
import PaginationStore, {
  PaginationConfig,
  PaginationError,
  PaginationItem,
  PaginationOuterFetchParams,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import {
  Callback,
  Disposable,
  UnionToIntersection,
} from "@utils/types";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from "mobx";
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

const SELECT_ALL_USERS_PARAMS: IFetchStoreParams<PaginationStoresUnion> =
  {
    count: 100,
    offset: 0,
    query: "",
  };

type UsersPaginationStore = IPaginationStore<
  PaginationItem<PaginationStoresUnion>,
  PaginationError<PaginationStoresUnion>
>;

export default class UsersPickerTabStore<
  ParamsNames extends UsersPaginationParamsNames
> implements Disposable
{
  private readonly _usersFetchStore: IVkApiFetchStore<ParamsNames>;
  private readonly _selectAllFetchStore: IVkApiFetchStore<ParamsNames>;
  private readonly _usersPaginationStore: UsersPaginationStore;
  private readonly _searchStore: ISearchStore;
  private readonly _checkedUsers: ICheckedUsersStore;
  private _ignoreSelectable = false;
  private readonly _selectAllUsersReaction: IReactionDisposer;

  constructor(
    checkedUsers: ICheckedUsersStore,
    usersFetchStore: Callback<IVkApiFetchStore<ParamsNames>>,
    selectAllUsersFetchStore: Callback<IVkApiFetchStore<ParamsNames>>,
    pagingParamsName: ParamsNames
  ) {
    this._searchStore = new SearchStore({
      initialText: "",
    });
    this._checkedUsers = checkedUsers;
    this._usersFetchStore = usersFetchStore();

    this._selectAllFetchStore = selectAllUsersFetchStore();
    this._usersPaginationStore = new PaginationStore(
      this._usersFetchStore as PaginationStoresUnion,
      createQueryParamsProvider(this._searchStore),
      USER_PAGINATION_CONFIG[pagingParamsName]
    );
    makeObservable<UsersPickerTabStore<any>, "_ignoreSelectable">(
      this,
      {
        loadState: computed,
        users: computed,
        setCurrentPage: action.bound,
        totalPagesCount: computed,
        query: computed,
        onSearchTextChange: action.bound,
        _ignoreSelectable: observable,
        ignoreSelectable: computed,
        toggleIgnoreSelectable: action.bound,
        selectableUsers: computed.struct,
        enabledUsers: computed,
        disabledUsers: computed,
        areAllPageUsersChecked: computed,
        onSelectAllPageChanged: action.bound,
        error: computed,
        retry: action.bound,
        onSelectAllUsers: action.bound,
        selectAllFetchState: computed,
      }
    );
    this._selectAllUsersReaction = reaction(
      () => this._selectAllFetchStore.data,
      (items) => {
        console.log("_selectAllUsersReaction");
        if (!items) return;
        const users =
          items.items?.map(userApiToUser).filter(isUserSelectable) ??
          [];
        this._checkedUsers.setCheckedMany(true, users);
      }
    );
  }

  onSelectAllUsers() {
    console.log("onSelectAllUsers");
    this._selectAllFetchStore.fetch(SELECT_ALL_USERS_PARAMS);
  }

  get selectAllFetchState(): Omit<
    IVkApiFetchStore<ParamsNames>,
    "fetch" | "data" | "response"
  > {
    return this._selectAllFetchStore;
  }

  get users() {
    return this._usersPaginationStore.pageItems.map(userApiToUser);
  }

  get loadState() {
    return this._usersPaginationStore.loadState;
  }

  get error() {
    return this._usersPaginationStore.error;
  }

  retry() {
    return this._usersPaginationStore.retry();
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
    this._ignoreSelectable = !this._ignoreSelectable;
    if (!this.ignoreSelectable && this.disabledUsers.length > 0) {
      this._checkedUsers.setCheckedMany(false, this.disabledUsers);
    }
  }

  get ignoreSelectable() {
    return this._ignoreSelectable;
  }

  get selectableUsers() {
    return this.users.map((user) => ({
      user,
      isSelectable: this._ignoreSelectable || isUserSelectable(user),
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

  get areAllPageUsersChecked() {
    return this.enabledUsers.every(({ id }) =>
      this._checkedUsers.checked.get(id)
    );
  }

  onSelectAllPageChanged() {
    if (!this.areAllPageUsersChecked) {
      this._checkedUsers.setCheckedMany(true, this.enabledUsers);
    } else {
      this._checkedUsers.setCheckedMany(false, this.enabledUsers);
    }
  }

  destroy() {
    console.log("PICKER DESTROY");
    this._searchStore.destroy();
    this._usersPaginationStore.destroy();
    this._usersFetchStore.destroy();
    this._selectAllUsersReaction();
  }
}
