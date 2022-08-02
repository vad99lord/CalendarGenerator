import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import useLaunchParams from "../hooks/useLaunchParams";
import { ChildrenProps } from "../utils/types";
import { createLateInitContext } from "../utils/utils";

type LaunchParams = GetLaunchParamsResponse;

export const LaunchParamsContext =
  createLateInitContext<LaunchParams>();

type LaunchParamsProviderProps = ChildrenProps;

export const LaunchParamsProvider = ({
  children,
}: LaunchParamsProviderProps) => {
  const launchParams = useLaunchParams();
  return (
    <LaunchParamsContext.Provider value={launchParams}>
      {children}
    </LaunchParamsContext.Provider>
  );
};
