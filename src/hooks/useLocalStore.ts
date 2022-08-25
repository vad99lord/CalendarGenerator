import { useEffect, useState } from "react";
import { ClassConstructor, Disposable } from "../utils/types";

const useLocalStore = <
  Store extends ClassConstructor<Store, Disposable>
>(
  storeConstructor: Store,
  ...args: ConstructorParameters<Store>
): InstanceType<Store> => {
  const [store] = useState(() => {
    return new storeConstructor(...args)
  });
  useEffect(() => {
    return () => {
      store.destroy();
    };
  }, [store]);
  return store;
};

export default useLocalStore;
