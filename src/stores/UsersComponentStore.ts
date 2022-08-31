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
import userApiToUser from "../network/models/User/userApiToUser";
import { isUserSelectable } from "../network/models/User/UserModel";
import { Disposable } from "../utils/types";
import CacheStore from "./CacheStore";
import CheckedUsersStore from "./CheckedUsersStore";
import SearchStore from "./SearchStore";
import VkApiFetchStore from "./VkApiFetchStore";
import {
  VkApiMethodParamsNames,
  VkApiQueryParams,
} from "./VkApiParamsProviderMap";

export type UsersSearchParamsNames = Extract<
  VkApiMethodParamsNames,
  "SearchFriendsByQuery" | "SearchUsersByQuery"
>;

type CachedState = {
  searchText: string;
  users: UsersUserFull[];
};

export default class UsersComponentStore<
  SearchParams extends UsersSearchParamsNames
> implements Disposable
{
  private _id: symbol;
  private _checkedUsers: CheckedUsersStore;
  private _friendsFetchStore: VkApiFetchStore<SearchParams>;
  private _cacheStore: CacheStore;
  private _users: UsersUserFull[] = [];
  private _searchStore!: SearchStore;
  ignoreSelectable = false;
  private _debouncedSearchTextReaction: IReactionDisposer;
  private _fetchDataReaction: IReactionDisposer;

  constructor(
    id: symbol, //id should be shared between instances of the same type
    checkedUsers: CheckedUsersStore,
    friendsFetchStore: VkApiFetchStore<SearchParams>,
    cacheStore: CacheStore
  ) {
    this._id = id;
    this._checkedUsers = checkedUsers;
    this._friendsFetchStore = friendsFetchStore;
    this._cacheStore = cacheStore;
    makeObservable<
      UsersComponentStore<any>,
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
