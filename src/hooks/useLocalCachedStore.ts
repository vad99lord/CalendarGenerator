import { CacheContext } from "@contexts/CacheContext";
import { ClassConstructor, Disposable } from "@utils/types";
import { useEffect } from "react";
import { useLateInitContext } from "./useLateInitContext";

const UNDEFINED_IDS_WARNING = `useLocalCachedStore: scopeId or dataId is undefined, store will be recreated each mount. 
  Consider using useLocalStore as it provides the same functionality in this case.`;

const useLocalCachedStore = <
  Store extends ClassConstructor<Store, Disposable>
>(
  scopeId: symbol | undefined,
  dataId: symbol | undefined,
  storeConstructor: Store,
  ...args: ConstructorParameters<Store>
) => {
  const cacheStore = useLateInitContext(CacheContext);
  const noCache = !scopeId || !dataId;
  let store: InstanceType<Store> & Disposable;
  useEffect(() => {
    return () => {
      if (noCache) {
        store.destroy();
      }
    };
  });
  if (noCache) {
    console.warn(UNDEFINED_IDS_WARNING);
    store = new storeConstructor(...args);
    return store;
  }
  const cachedStore = cacheStore.cached<
    InstanceType<Store> & Disposable
  >(scopeId, dataId);
  if (!cachedStore) {
    const store = new storeConstructor(...args);
    cacheStore.cache(scopeId, dataId, store);
    return store;
  }
  return cachedStore;
};

export default useLocalCachedStore;
