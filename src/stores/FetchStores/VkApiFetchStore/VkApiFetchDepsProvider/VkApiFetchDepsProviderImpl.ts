import { IAuthStore } from "@stores/types/IAuthStore";
import { IConfigStore } from "@stores/types/IConfigStore";
import {
  VkApiFetchDeps,
  VkApiFetchDepsProvider,
} from "./VkApiFetchDepsProvider";

export class VkApiFetchDepsProviderImpl implements VkApiFetchDepsProvider {
  private readonly _configStore: IConfigStore;
  private readonly _authStore: IAuthStore;
  constructor(configStore: IConfigStore, authStore: IAuthStore) {
    this._configStore = configStore;
    this._authStore = authStore;
  }
  getFetchDeps(): VkApiFetchDeps {
    return {
      launchParams: this._configStore.data,
      token: this._authStore.data?.access_token,
    };
  }
}
