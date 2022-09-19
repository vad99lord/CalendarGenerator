import {
  createLateInitContext,
  useLateInitContext,
} from "@hooks/useLateInitContext";
import { useLocalStoreCreator } from "@hooks/useLocalStore";
import FetchDepsProvider from "@stores/FetchStores/FetchDepsProvider/FetchDepsProvider";
import VkBridgeFetchStore from "@stores/FetchStores/VkBridgeFetchStore/VkBridgeFetchStore";
import VkBridgeParamsProvider from "@stores/FetchStores/VkBridgeFetchStore/VkBridgeParamsProvider/VkBridgeParamsProvider";
import { IAuthStore } from "@stores/types/IAuthStore";
import { ChildrenProps, Disposable } from "@utils/types";
import { useCallback } from "react";
import { ConfigContext } from "./ConfigContext";

export const AuthContext = createLateInitContext<IAuthStore>();

type AuthProviderProps = ChildrenProps;

type AuthDeps = {
  appId?: number;
};

const authParams: VkBridgeParamsProvider<
  "VKWebAppGetAuthToken",
  void,
  AuthDeps
> = {
  getVkBridgeParams(params: Required<AuthDeps>) {
    return [
      "VKWebAppGetAuthToken",
      { app_id: params.appId, scope: "friends" },
    ];
  },
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const launchParamsStore = useLateInitContext(ConfigContext);
  const authStoreCreator = useCallback(() => {
    const authDeps: FetchDepsProvider<AuthDeps> = {
      getFetchDeps(): AuthDeps {
        return {
          appId: launchParamsStore.data?.vk_app_id,
        };
      },
    };
    const store: IAuthStore & Disposable = new VkBridgeFetchStore(
      authDeps,
      authParams
    );
    return store;
  }, [launchParamsStore]);
  const authStore = useLocalStoreCreator(authStoreCreator);
  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
};
