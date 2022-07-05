import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import { createContext } from "react";
import useLaunchParams from "../hooks/useLaunchParams";
import { createLateInitContext } from "../utils/utils";

type LaunchParams = GetLaunchParamsResponse;

export const LaunchParamsContext =
  createLateInitContext<LaunchParams>();

type Props = {
  children: React.ReactNode;
};
export const LaunchParamsProvider = ({ children }: Props) => {
  const launchParams = useLaunchParams();
  return (
    <LaunchParamsContext.Provider value={launchParams}>
      {children}
    </LaunchParamsContext.Provider>
  );
};
