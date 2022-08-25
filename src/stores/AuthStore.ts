import {
  action,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { fetchVkBridge } from "../network/vk/fetchVkBridge";
import { Disposable } from "../utils/types";
import { LaunchParams } from "./ConfigStore";

export default class AuthStore implements Disposable {
  token?: string = undefined;

  constructor() {
    makeObservable(this, {
      token: observable,
      fetch: action.bound,
    });
  }

  destroy() {}

  async fetch(launchParams: LaunchParams) {
    const { data: response, isError } = await fetchVkBridge(
      "VKWebAppGetAuthToken",
      {
        app_id: launchParams.vk_app_id,
        scope: "friends",
      }
    );
    if (!isError) {
      runInAction(() => {
        this.token = response.access_token;
      });
    }
  }
}
