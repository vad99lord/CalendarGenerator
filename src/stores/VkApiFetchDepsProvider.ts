import { LaunchParams } from "./ConfigStore";

export type VkApiFetchDeps = {
  token?: string;
  launchParams?: LaunchParams;
};

export interface VkApiFetchDepsProvider {
  getVkApiFetchDeps(): VkApiFetchDeps;
}
