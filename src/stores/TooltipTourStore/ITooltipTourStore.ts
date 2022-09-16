import { Disposable } from "@utils/types";

export type TourTooltipState = {
  isShown: boolean;
  onClose: () => void;
};

export default interface ITooltipTourStore extends Disposable {
  /**
   * @param step 1-based index
   */
  tooltipState: (stepId: number) => TourTooltipState;

  start: () => void;
  stop: () => void;
}
