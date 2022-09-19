export type TourTooltipState = {
  isShown: boolean;
  onClose: () => void;
};

export default interface ITooltipTourStore {
  /**
   * @param step 1-based index
   */
  tooltipState: (stepId: number) => TourTooltipState;
  start: () => void;
  stop: () => void;
  isStopped: boolean;
}
