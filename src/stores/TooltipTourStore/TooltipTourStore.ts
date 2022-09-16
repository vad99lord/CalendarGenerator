import { noOp } from "@utils/utils";
import { action, comparer, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import ITooltipTourStore from "./ITooltipTourStore";

enum TooltipTourState {
  ACTIVE,
  STOPPED,
}

type TooltipTourStepState =
  | {
      step?: undefined;
      state: TooltipTourState.STOPPED;
    }
  | {
      step: number;
      state: TooltipTourState.ACTIVE;
    };

export default class TooltipTourStore implements ITooltipTourStore {
  // private _currentStep: number = 0;
  // private _tourState: TooltipTourState = TooltipTourState.STOPPED;
  private _tourStepState: TooltipTourStepState = {
    state: TooltipTourState.STOPPED,
  };

  constructor() {
    makeObservable<
      TooltipTourStore,
      "_onCloseTooltip" | "_tourStepState"
    >(this, {
      _onCloseTooltip: action.bound,
      // _currentStep: observable,
      // _tourState: observable,
      _tourStepState: observable,
    });
  }

  // get tooltipsState(): TourTooltipState[] {
  //   return Array.from(
  //     { length: this._tooltipsCount },
  //     (_tooltip, ind) => {
  //       const isShown = ind + 1 === this._currentStep ? true : false;
  //       return {
  //         isShown,
  //         onClose: this._onCloseTooltip,
  //       };
  //     }
  //   );
  // }

  tooltipState = computedFn(
    (stepId: number) => {
      if (Number.isInteger(stepId) && stepId < 1)
        throw Error(
          "TooltipTourStore: stepId should be positive integer!"
        );
      const { step, state } = this._tourStepState;
      if (state === TooltipTourState.STOPPED)
        return {
          isShown: false,
          onClose: noOp,
        };
      const isShown = step === stepId ? true : false;
      return {
        isShown,
        onClose: this._onCloseTooltip,
      };
    },
    {
      equals: comparer.structural,
    }
  );

  private _onCloseTooltip() {
    const { state, step } = this._tourStepState;
    if (state !== TooltipTourState.ACTIVE) return;
    this._tourStepState = {
      state,
      step: step + 1,
    };
  }

  start() {
    this._tourStepState = {
      state: TooltipTourState.ACTIVE,
      step: 1,
    };
  }

  stop() {
    this._tourStepState = {
      state: TooltipTourState.STOPPED,
    };
  }

  destroy() {}
}
