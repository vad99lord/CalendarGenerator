import { ClassConstructor, Disposable } from "@utils/types";
import { useEffect, useState } from "react";

const useDisposableStore = <Store extends Disposable>(
  store: Store
): Store => {
  useEffect(() => {
    return () => {
      store.destroy();
    };
  }, [store]);
  return store;
};

// Warning: useLocalStore doesn't support class with overloads
// and erase generics, use useLocalStoreCreator for such cases
const useLocalStore = <
  Store extends ClassConstructor<Store, Disposable>
>(
  storeConstructor: Store,
  ...args: ConstructorParameters<Store>
): InstanceType<Store> => {
  const [store] = useState(() => {
    return new storeConstructor(...args);
  });
  return useDisposableStore(store);
};

export const useLocalStoreCreator = <Store extends Disposable>(
  storeCreator: () => Store
): Store => {
  const [store] = useState(storeCreator);
  return useDisposableStore(store);
};

export default useLocalStore;
