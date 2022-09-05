import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import {
  VkApiFetchDeps,
  VkApiFetchDepsProvider,
} from "./VkApiFetchDepsProvider";

export class VkApiFetchDepsProviderImpl
  implements VkApiFetchDepsProvider
{
  private readonly _configStore: ConfigStore;
  private readonly _authStore: AuthStore;
  constructor(configStore: ConfigStore, authStore: AuthStore) {
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
