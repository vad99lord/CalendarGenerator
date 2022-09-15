import { isVkErrorData } from "@network/vk/VkErrorLogger";
import { IAuthStore } from "@stores/types/IAuthStore";
import { Disposable } from "@utils/types";
import { action, computed, makeObservable } from "mobx";

//denial error code form docs
const USER_DENIED_ERROR_CODE = 4;

export default class UserAuthStore implements Disposable {
  private readonly _authStore: IAuthStore;

  constructor(authStore: IAuthStore) {
    this._authStore = authStore;
    makeObservable<UserAuthStore>(this, {
      auth: action.bound,
      loadState: computed,
      data: computed,
      userDeniedAuth: computed,
    });
    this._auth();
  }

  private _auth() {
    this._authStore.fetch();
  }

  auth() {
    this._authStore.fetch();
  }

  get data() {
    return this._authStore.data;
  }

  get error() {
    return this._authStore.error;
  }

  get userDeniedAuth() {
    if (!isVkErrorData(this.error)) return false;
    if (
      this.error.error_type === "client_error" &&
      this.error.error_data.error_code === USER_DENIED_ERROR_CODE
    ) {
      return true;
    }
    return false;
  }

  get loadState() {
    return this._authStore.loadState;
  }

  destroy() {}
}
