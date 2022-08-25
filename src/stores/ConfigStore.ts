import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";
import {
  action,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { fetchVkBridge } from "../network/vk/fetchVkBridge";
import { Disposable } from "../utils/types";

export type LaunchParams = GetLaunchParamsResponse;

export default class ConfigStore implements Disposable {
  launchParams?: LaunchParams = undefined;

  constructor() {
    makeObservable(this, {
      launchParams: observable,
      fetch: action.bound,
    });
    this.fetch();
  }

  destroy() {}

  async fetch() {
    const { data: launchParams, isError } = await fetchVkBridge(
      "VKWebAppGetLaunchParams"
    );
    if (!isError) {
      runInAction(() => {
        this.launchParams = launchParams;
      });
    }
  }
}
