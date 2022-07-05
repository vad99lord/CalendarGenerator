import { useContext } from "react";
import useToken from "../hooks/useToken";
import { createLateInitContext } from "../utils/utils";
import { LaunchParamsContext } from "./LaunchParamsContext";

export const TokenContext = createLateInitContext<string>();

type Props = {
  children: React.ReactNode;
};
export const TokenProvider = ({ children }: Props) => {
  const launchParams = useContext(LaunchParamsContext);
  const token = useToken(launchParams);
  console.log(
    `TokenProvider rerender with ${JSON.stringify(
      launchParams
    )} and ${JSON.stringify(token)}`
  );
  return (
    <TokenContext.Provider value={token}>
      {children}
    </TokenContext.Provider>
  );
};
