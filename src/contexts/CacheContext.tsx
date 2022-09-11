import { createLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import CacheStore from "@stores/CacheStore/CacheStore";
import { ChildrenProps } from "@utils/types";

export const CacheContext = createLateInitContext<CacheStore>();

type ConfigProviderProps = ChildrenProps;

export const CacheProvider = ({ children }: ConfigProviderProps) => {
  const cacheStore: CacheStore = useLocalStore(CacheStore);
  return (
    <CacheContext.Provider value={cacheStore}>
      {children}
    </CacheContext.Provider>
  );
};
