import { AuthContext } from "@contexts/AuthContext";
import { ConfigContext } from "@contexts/ConfigContext";
import { VkApiFetchDepsProviderImpl } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchDepsProvider/VkApiFetchDepsProviderImpl";
import VkApiFetchStore, {
  IVkApiFetchStore,
} from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import {
  VkApiMethodParamsNames,
  VK_API_PARAMS_PROVIDER_MAP,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { AuthStore } from "@stores/types/AuthStore";
import { ConfigStore } from "@stores/types/ConfigStore";
import { Callback } from "@utils/types";
import { useCallback } from "react";
import { useLateInitContext } from "./useLateInitContext";
import { useLocalStoreCreator } from "./useLocalStore";

const createVkApiFetchStore = <
  ParamsName extends VkApiMethodParamsNames
>(
  name: ParamsName,
  authStore: AuthStore,
  configStore: ConfigStore
) => {
  return new VkApiFetchStore<ParamsName>(
    new VkApiFetchDepsProviderImpl(configStore, authStore),
    VK_API_PARAMS_PROVIDER_MAP[name]
  );
};

const useVkApiFetchStore = <
  ParamsName extends VkApiMethodParamsNames
>(
  name: ParamsName
) => {
  const authStore = useLateInitContext(AuthContext);
  const configStore = useLateInitContext(ConfigContext);
  const fetchStore: IVkApiFetchStore<ParamsName> =
    useLocalStoreCreator(() =>
      createVkApiFetchStore(name, authStore, configStore)
    );

  return fetchStore;
};

export const useVkApiFetchStoreCallback = <
  ParamsName extends VkApiMethodParamsNames
>(
  name: ParamsName
) => {
  const authStore = useLateInitContext(AuthContext);
  const configStore = useLateInitContext(ConfigContext);
  const fetchStoreCallback: Callback<IVkApiFetchStore<ParamsName>> =
    useCallback(
      () => createVkApiFetchStore(name, authStore, configStore),
      [authStore, configStore, name]
    );

  return fetchStoreCallback;
};

export default useVkApiFetchStore;
