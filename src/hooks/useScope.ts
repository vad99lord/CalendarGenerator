import { CacheContext } from "@contexts/CacheContext";
import { useEffect, useState } from "react";
import { useLateInitContext } from "./useLateInitContext";

/**
 * Create scope in global cache store
 *
 * @returns id of the scope being created
 */
const useScope = () => {
  const cacheStore = useLateInitContext(CacheContext);
  const [{ id }] = useState(() => {
    return cacheStore.createScope(Symbol());
  });
  useEffect(() => {
    return () => {
      cacheStore.destroyScope(id);
    };
  }, [cacheStore, id]);
  return id;
};

export default useScope;
