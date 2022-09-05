import { createLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import CacheStore from "@stores/CacheStore/CacheStore";
import ICacheStore from "@stores/CacheStore/ICacheStore";
import { ChildrenProps } from "@utils/types";

export const CacheContext = createLateInitContext<ICacheStore>();

type ConfigProviderProps = ChildrenProps;

export const CacheProvider = ({ children }: ConfigProviderProps) => {
  const cacheStore: ICacheStore = useLocalStore(CacheStore);
  return (
    <CacheContext.Provider value={cacheStore}>
      {children}
    </CacheContext.Provider>
  );
};
