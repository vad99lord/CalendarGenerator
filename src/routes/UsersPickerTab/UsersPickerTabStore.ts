import userApiToUser from "@network/models/User/userApiToUser";
import { isUserSelectable } from "@network/models/User/UserModel";
import ICacheStore from "@stores/CacheStore/ICacheStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { IVkApiFetchStore } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import {
  VkApiMethodParamsNames,
  VkApiQueryParams,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import SearchStore from "@stores/SearchStore/SearchStore";
import { Disposable } from "@utils/types";
import { UsersUserFull } from "@vkontakte/api-schema-typescript";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  toJS,
} from "mobx";
import { ChangeEvent } from "react";

export type UsersSearchParamsNames = Extract<
  VkApiMethodParamsNames,
  "SearchFriendsByQuery" | "SearchUsersByQuery"
>;

type CachedState = {
  searchText: string;
  users: UsersUserFull[];
};

export default class UsersPickerTabStore<
  SearchParams extends UsersSearchParamsNames
> implements Disposable
{
  private readonly _id: symbol;
  private readonly _checkedUsers: ICheckedUsersStore;
  private readonly _friendsFetchStore: IVkApiFetchStore<SearchParams>;
  private readonly _cacheStore: ICacheStore;
  private _users: UsersUserFull[] = [];
  private _searchStore!: ISearchStore;
  ignoreSelectable = false;
  private readonly _debouncedSearchTextReaction: IReactionDisposer;
  private readonly _fetchDataReaction: IReactionDisposer;

  constructor(
    id: symbol, //id should be shared between instances of the same type
    checkedUsers: ICheckedUsersStore,
    friendsFetchStore: IVkApiFetchStore<SearchParams>,
    cacheStore: ICacheStore
  ) {
    this._id = id;
    this._checkedUsers = checkedUsers;
    this._friendsFetchStore = friendsFetchStore;
    this._cacheStore = cacheStore;
    makeObservable<
      UsersPickerTabStore<any>,
      "_users" | "_setUsers" | "_hydrate"
    >(this, {
      ignoreSelectable: observable,
      toggleIgnoreSelectable: action.bound,
      selectableUsers: computed,
      enabledUsers: computed,
      disabledUsers: computed,
      areAllUsersChecked: computed,
      fetch: action.bound,
      onSelectAllChanged: action.bound,
      loadState: computed,
      _users: observable,
      _setUsers: action.bound,
      query: computed,
      onSearchTextChange: action.bound,
      users: computed,
      _hydrate: action.bound,
    });
    this._hydrate();
    this._debouncedSearchTextReaction = reaction(
      () => this._searchStore.debouncedSearchText,
      (query) => {
        console.log("QUERY REACTION", toJS(query));
        this.fetch({ query });
      }
    );
    this._fetchDataReaction = reaction(
      () => this._friendsFetchStore.data,
      (data) => {
        console.log("FETCH REACTION", toJS(data));
        if (!data) return;
        this._setUsers(data.items ?? []);
      }
    );
  }

  private _hydrate() {
    const hydratedState = this._cacheStore.cached<CachedState>(
      this._id
    );
    console.log({ hydratedState });
    if (!hydratedState) {
      const defaultText = "";
      this._searchStore = new SearchStore({
        initialText: defaultText,
      });
      this._users = [];
      this.fetch({ query: defaultText });
    } else {
      const { searchText, users } = hydratedState;
      this._searchStore = new SearchStore({
        initialText: searchText,
      });
      this._users = users;
    }
  }

  private _setUsers(users: UsersUserFull[]) {
    this._users = users;
  }

  get query() {
    return this._searchStore.searchText;
  }

  onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    this._searchStore.onSearchTextChange(e);
  }

  get users() {
    return this._users.map(userApiToUser);
  }

  get loadState() {
    return this._friendsFetchStore.loadState;
  }

  fetch(params: VkApiQueryParams[SearchParams]) {
    this._friendsFetchStore.fetch(params);
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
    this._cacheStore.cache<CachedState>(this._id, {
      searchText: this._searchStore.searchText,
      users: this._users,
    });
    this._searchStore.destroy();
    this._debouncedSearchTextReaction();
    this._fetchDataReaction();
  }
}
