import { useCallback, useEffect } from "react";
import { createLateInitContext } from "../hooks/useLateInitContext";
import { useLocalStoreCreator } from "../hooks/useLocalStore";
import { ConfigStore } from "../stores/ConfigStore";
import { emptyDepsProvider } from "../stores/VkApiFetchDepsProvider";
import { VkBridgeParamsProvider } from "../stores/VkApiParamsProvider";
import VkBridgeFetchStore from "../stores/VkBridgeFetchStore";
import { ChildrenProps } from "../utils/types";

export const ConfigContext = createLateInitContext<ConfigStore>();

type ConfigProviderProps = ChildrenProps;

const configParams: VkBridgeParamsProvider<"VKWebAppGetLaunchParams"> =
  {
    getVkBridgeParams: function () {
      return ["VKWebAppGetLaunchParams"];
    },
  };

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const configStoreCreator = useCallback(
    () => new VkBridgeFetchStore(emptyDepsProvider, configParams),
    []
  );
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
