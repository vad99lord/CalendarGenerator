import { autorun } from "mobx";
import { useEffect } from "react";
import {
  createLateInitContext,
  useLateInitContext,
} from "../hooks/useLateInitContext";
import useLocalStore from "../hooks/useLocalStore";
import AuthStore from "../stores/AuthStore";
import { ChildrenProps } from "../utils/types";
import { ConfigContext } from "./ConfigContext";

export const AuthContext = createLateInitContext<AuthStore>();

type AuthProviderProps = ChildrenProps;
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authStore = useLocalStore(AuthStore);
  const launchParamsStore = useLateInitContext(ConfigContext);
  useEffect(() => {
    return autorun(() => {
      const { launchParams } = launchParamsStore;
      if (!launchParams) return;
      authStore.fetch(launchParams);
    });
  }, [launchParamsStore, authStore]);
  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};
