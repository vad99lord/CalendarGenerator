import { UserModel } from "@network/models/User/UserModel";
import { ApiSuccess } from "@network/types/ApiResponse";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { PaginationParams } from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { LoadState } from "@stores/FetchStores/LoadState";
import {
  IPaginationFetchStore,
  PaginationFetchResponse,
} from "@stores/PaginationStore/PaginationStore";
import ISearchStore from "@stores/SearchStore/ISearchStore";
import { Disposable } from "@utils/types";
import { filterValues } from "@utils/utils";
import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  toJS,
} from "mobx";

export type FetchParams = PaginationParams;
export type ErrorData = string;

export type ISelectedUsersFetchStore = IPaginationFetchStore<
  FetchParams,
  UserModel,
  ErrorData
>;

export default class SelectedUsersFetchStore
  implements ISelectedUsersFetchStore, Disposable
{
  private readonly _checkedUsers: ICheckedUsersStore;
  private readonly _searchStore: ISearchStore;

  private _fetchParams?: FetchParams;
  private _response?: ApiSuccess<PaginationFetchResponse<UserModel>>;

  constructor(
    checkedUsers: ICheckedUsersStore,
    searchStore: ISearchStore
  ) {
    this._checkedUsers = checkedUsers;
    this._searchStore = searchStore;

    makeObservable<
      SelectedUsersFetchStore,
      "_filteredSelectedUsers" | "_response"
    >(this, {
      loadState: computed,
      _response: observable,
      response: computed,
      data: computed,
      error: computed,
      fetch: action.bound,
      _filteredSelectedUsers: computed,
    });
    autorun(() => {
      const state = {
        _filteredSelectedUsers: toJS(this._filteredSelectedUsers),
        _paginatedFilteredSelectedUsers: toJS(
          this._paginatedFilteredSelectedUsers
        ),
        _fetchParams: toJS(this._fetchParams),
      };
      console.log("selectedPagination", state);
    });
  }

  private get _filteredSelectedUsers() {
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

  private _paginatedFilteredSelectedUsers(
    count: number,
    offset: number
  ) {
    return this._filteredSelectedUsers.slice(offset, offset + count);
  }

  get loadState() {
    return LoadState.Success;
  }

  get response():
    | ApiSuccess<PaginationFetchResponse<UserModel>>
    | undefined {
    return this._response;
  }

  get data() {
    return this.response?.data;
  }

  get error() {
    return undefined;
  }

  fetch(params: FetchParams) {
    const users = this._paginatedFilteredSelectedUsers(
      params.count,
      params.offset
    );
    this._response = {
      isError: false,
      data: {
        count: this._filteredSelectedUsers.length,
        items: users,
      },
    };
  }

  destroy() {}
}
