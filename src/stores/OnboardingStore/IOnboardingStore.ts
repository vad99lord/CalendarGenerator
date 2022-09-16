import { Disposable } from "@utils/types";

export default interface IOnboardingStore extends Disposable {
  startTooltipTour(): void;
}
