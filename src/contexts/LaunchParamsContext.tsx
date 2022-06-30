import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import { createContext } from "react";
import useLaunchParams from "../hooks/useLaunchParams";

type LaunchParams = GetLaunchParamsResponse;

export const LaunchParamsContext = createContext<
  LaunchParams | undefined
>(undefined);

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
