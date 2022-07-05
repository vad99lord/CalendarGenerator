import { useState } from "react";
import { fetchVkBridge } from "../network/vk/fetchVkBridge";
import useAsyncEffect from "./useAsyncEffect";
import { LaunchParams } from "./useLaunchParams";

const useToken = (launchParams: LaunchParams | undefined) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  useAsyncEffect(async () => {
    if (!launchParams) return;
    const { data: response, isError } = await fetchVkBridge(
      "VKWebAppGetAuthToken",
      {
        app_id: launchParams.vk_app_id,
        scope: "friends",
      }
    );
    if (!isError) {
      setToken(response.access_token);
    }
  }, [launchParams]);
  return token;
};

export default useToken;
