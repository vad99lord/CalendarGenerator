import { LaunchParams } from "../../../types/IConfigStore";
import FetchDepsProvider from "../../FetchDepsProvider/FetchDepsProvider";

export type VkApiFetchDeps = {
  token?: string;
  launchParams?: LaunchParams;
};

export type VkApiFetchDepsProvider =
  FetchDepsProvider<VkApiFetchDeps>;
