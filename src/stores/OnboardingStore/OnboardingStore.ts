import ITooltipTourStore from "@stores/TooltipTourStore/ITooltipTourStore";
import VkStorageStore from "@stores/VkStorageStore/VkStorageStore";
import { Disposable } from "@utils/types";
import {
  action,
  IReactionDisposer,
  makeObservable,
  reaction,
} from "mobx";
import IOnboardingStore from "./IOnboardingStore";

export default class OnboardingStore
  implements IOnboardingStore, Disposable
{
  private readonly _tooltipTourFinishedReaction: IReactionDisposer;
  private readonly _tooltipTourStore: ITooltipTourStore;

  constructor(tooltipTourStore: ITooltipTourStore) {
    this._tooltipTourStore = tooltipTourStore;
    makeObservable(this, {
      startTooltipTour: action.bound,
    });
    this._tooltipTourFinishedReaction = reaction(
      () => this._tooltipTourStore.isStopped,
      (isTourStopped) => {
        console.log("_tooltipTourFinishedReaction", isTourStopped);
        if (!isTourStopped) return;
        this._setIsOnboardingShown();
      }
    );
  }

  startTooltipTour() {
    this._startTooltipTour();
  }

  private async _startTooltipTour() {
    const isShown = await this._getIsOnboardingShown();
    if (!isShown) {
      this._tooltipTourStore.start();
    }
  }

  private async _getIsOnboardingShown() {
    const response = await VkStorageStore.getStorage(["isShown"]);
    if (!response.isError) {
      const storage = response.data.keys;
      console.log("STORAGE GET", storage);
      return Boolean(storage.isShown);
    }
    return false;
  }

  private async _setIsOnboardingShown() {
    const response = await VkStorageStore.setStorage("isShown", true);
    if (!response.isError) {
      return true;
    }
    return false;
  }

  destroy() {
    this._tooltipTourFinishedReaction();
  }
}
