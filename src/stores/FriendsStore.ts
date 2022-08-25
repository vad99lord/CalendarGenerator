import { action, computed, makeObservable } from "mobx";
import userApiToUser from "../network/models/User/userApiToUser";
import { UserModel } from "../network/models/User/UserModel";
import { Disposable } from "../utils/types";
import VkApiFetchStore from "./VkApiFetchStore";
import {
  VkApiMethodParamsNames,
  VkApiQueryParams,
} from "./VkApiParamsProviderMap";

export default class FriendsStore<
  ParamsName extends VkApiMethodParamsNames = "SearchFriendsByQuery"
> implements Disposable
{
  private _friendsFetchStore: VkApiFetchStore<ParamsName>;
  constructor(friendsFetchStore: VkApiFetchStore<ParamsName>) {
    this._friendsFetchStore = friendsFetchStore;
    makeObservable(this, { friends: computed, fetch: action });
  }

  get friends(): UserModel[] {
    const { data } = this._friendsFetchStore;
    const modelFriends = data?.items.map(userApiToUser) ?? [];
    return modelFriends;
  }

  fetch(params: VkApiQueryParams[ParamsName]) {
    this._friendsFetchStore.fetch(params);
  }
  destroy() {}
}
