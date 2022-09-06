import userApiToUser from "@network/models/User/userApiToUser";
import { VkApiMethodParamsNames } from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import PaginationStore, {
  IPaginationFetchStore,
} from "@stores/PaginationStore/PaginationStore";
import { Disposable } from "@utils/types";
import { UsersUserFull } from "@vkontakte/api-schema-typescript";
import { action, computed, makeObservable } from "mobx";

export type UsersPaginateParamsNames = Extract<
  VkApiMethodParamsNames,
  "PaginateFriends"
>;

export default class UsersPaginationStore<Item extends UsersUserFull>
  implements Disposable
{
  private readonly _usersFetchStore: IPaginationFetchStore<Item>;
  private readonly _usersPaginationStore: PaginationStore<Item>;
  constructor(friendsFetchStore: IPaginationFetchStore<Item>) {
    this._usersFetchStore = friendsFetchStore;
    this._usersPaginationStore = new PaginationStore(
      this._usersFetchStore
    );
    makeObservable(this, {
      // fetch: action.bound,
      loadState: computed,
      users: computed,
      setCurrentPage: action.bound,
      totalPagesCount: computed,
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

  destroy() {}
}
