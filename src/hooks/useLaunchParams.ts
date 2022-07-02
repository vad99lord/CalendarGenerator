import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import { useState } from "react";
import { fetchVkBridge } from "../network/vk/fetchVkBridge";
import useAsyncEffect from "./useAsyncEffect";
type LaunchParams = GetLaunchParamsResponse;

const useLaunchParams = () => {
  const [launchParams, setLaunchParams] = useState<LaunchParams>();

  useAsyncEffect(async () => {
    const { data: launchParams, isError } = await fetchVkBridge(
      "VKWebAppGetLaunchParams"
    );
    if (!isError) {
      setLaunchParams(launchParams);
    }
  }, []);
  return launchParams;
};

export default useLaunchParams;
