import { createLateInitContext } from "@hooks/useLateInitContext";
import { useLocalStoreCreator } from "@hooks/useLocalStore";
import emptyDepsProvider from "@stores/FetchStores/FetchDepsProvider/EmptyFetchDepsProvider";
import VkBridgeFetchStore, {
  IVkBridgeFetchStore,
} from "@stores/FetchStores/VkBridgeFetchStore/VkBridgeFetchStore";
import VkBridgeParamsProvider from "@stores/FetchStores/VkBridgeFetchStore/VkBridgeParamsProvider/VkBridgeParamsProvider";
import { ConfigStore } from "@stores/types/ConfigStore";
import { ChildrenProps } from "@utils/types";
import { useCallback, useEffect } from "react";

export const ConfigContext = createLateInitContext<ConfigStore>();

type ConfigProviderProps = ChildrenProps;

const configParams: VkBridgeParamsProvider<"VKWebAppGetLaunchParams"> =
  {
    getVkBridgeParams: function () {
      return ["VKWebAppGetLaunchParams"];
    },
  };

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const configStoreCreator = useCallback(() => {
    const store: IVkBridgeFetchStore<"VKWebAppGetLaunchParams"> =
      new VkBridgeFetchStore(emptyDepsProvider, configParams);
    return store;
  }, []);
  const configStore = useLocalStoreCreator(configStoreCreator);
  useEffect(() => {
    configStore.fetch();
  }, [configStore]);
  return (
    <ConfigContext.Provider value={configStore}>
      {children}
    </ConfigContext.Provider>
  );
};
