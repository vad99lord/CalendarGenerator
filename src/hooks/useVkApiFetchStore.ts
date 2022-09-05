import { AuthContext } from "@contexts/AuthContext";
import { ConfigContext } from "@contexts/ConfigContext";
import { VkApiFetchDepsProviderImpl } from "@stores/FetchStores/VkApiFetchStore/VkApiFetchDepsProvider/VkApiFetchDepsProviderImpl";
import VkApiFetchStore from "@stores/FetchStores/VkApiFetchStore/VkApiFetchStore";
import {
  VkApiMethodParamsNames,
  VK_API_PARAMS_PROVIDER_MAP,
} from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import { useLateInitContext } from "./useLateInitContext";
import useLocalStore from "./useLocalStore";

const useVkApiFetchStore = <
  ParamsName extends VkApiMethodParamsNames
>(
  name: ParamsName
) => {
  const authStore = useLateInitContext(AuthContext);
  const configStore = useLateInitContext(ConfigContext);
  const fetchStore = useLocalStore(
    VkApiFetchStore<ParamsName>,
    new VkApiFetchDepsProviderImpl(configStore, authStore),
    VK_API_PARAMS_PROVIDER_MAP[name]
  );
  return fetchStore;
};

export default useVkApiFetchStore;
