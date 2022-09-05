import { LaunchParams } from "./ConfigStore";

export type VkApiFetchDeps = {
  token?: string;
  launchParams?: LaunchParams;
};

export type VkApiFetchDepsProvider =
  FetchDepsProvider<VkApiFetchDeps>;

export interface FetchDepsProvider<Deps> {
  getFetchDeps(): Deps;
}

export const emptyDepsProvider: FetchDepsProvider<void> = {
  getFetchDeps() {
    return null;
  },
};
