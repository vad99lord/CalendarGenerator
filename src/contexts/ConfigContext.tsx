import { createLateInitContext } from "../hooks/useLateInitContext";
import useLocalStore from "../hooks/useLocalStore";
import ConfigStore from "../stores/ConfigStore";
import { ChildrenProps } from "../utils/types";

export const ConfigContext = createLateInitContext<ConfigStore>();

type ConfigProviderProps = ChildrenProps;

export const ConfigProvider = ({
  children,
}: ConfigProviderProps) => {
  const configStore = useLocalStore(ConfigStore);
  return (
    <ConfigContext.Provider value={configStore}>
      {children}
    </ConfigContext.Provider>
  );
};
