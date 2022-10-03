import { Disposable } from "@utils/types";
import { noOp } from "@utils/utils";
import {
  action,
  comparer,
  computed,
  makeObservable,
  observable,
} from "mobx";
import { computedFn } from "mobx-utils";
import ITooltipTourStore from "./ITooltipTourStore";

enum TooltipTourState {
  INITIAL,
  ACTIVE,
  STOPPED,
}

type TooltipTourStepState =
  | {
      step?: undefined;
      state: TooltipTourState.STOPPED | TooltipTourState.INITIAL;
    }
  | {
      step: number;
      state: TooltipTourState.ACTIVE;
    };

export default class TooltipTourStore
  implements ITooltipTourStore, Disposable
{
  private _tourStepState: TooltipTourStepState = {
    state: TooltipTourState.INITIAL,
  };
  private _tooltipsCount: number;

  constructor(tooltipsCount: number) {
    this._tooltipsCount = tooltipsCount;
    makeObservable<
      TooltipTourStore,
      "_onCloseTooltip" | "_tourStepState"
    >(this, {
      _onCloseTooltip: action.bound,
      _tourStepState: observable,
      isStopped: computed,
      start: action.bound,
      stop: action.bound,
    });
  }

  get isStopped() {
    return this._tourStepState.state === TooltipTourState.STOPPED;
  }

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
    if (step === this._tooltipsCount) {
      this._tourStepState = {
        state: TooltipTourState.STOPPED,
      };
      return;
    }
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
