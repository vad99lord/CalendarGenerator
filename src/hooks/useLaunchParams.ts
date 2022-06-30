import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import { useState } from "react";
import {
  fetchVkApi,
  isValidResponse
} from "../utils/network/fetchVkApi";
import useAsyncEffect from "./useAsyncEffect";
type LaunchParams = GetLaunchParamsResponse;

const useLaunchParams = () => {
  const [launchParams, setLaunchParams] = useState<LaunchParams>();

  useAsyncEffect(async () => {
    const launchParamsResponse = await fetchVkApi(
      "VKWebAppGetLaunchParams"
    );
    if (isValidResponse(launchParamsResponse)) {
      setLaunchParams(launchParamsResponse);
    }
  }, []);
  return launchParams;
};

export default useLaunchParams;
