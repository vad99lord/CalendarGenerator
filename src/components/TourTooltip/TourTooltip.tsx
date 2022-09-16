import { TooltipContext } from "@contexts/TooltipContext";
import { useLateInitContext } from "@hooks/useLateInitContext";
import { Tooltip, TooltipProps } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";

export interface TourTooltipStep {
  stepId: number;
}

export interface TourTooltipProps
  extends Omit<TooltipProps, "isShown" | "onClose">,
    TourTooltipStep {
  stepId: number;
}

const TourTooltip = ({ stepId, ...props }: TourTooltipProps) => {
  const tooltipTourStore = useLateInitContext(TooltipContext);
  const { isShown, onClose } = tooltipTourStore.tooltipState(stepId);
  console.log("TourTooltip render", stepId);
  return <Tooltip isShown={isShown} onClose={onClose} {...props} />;
};

export default observer(TourTooltip);
