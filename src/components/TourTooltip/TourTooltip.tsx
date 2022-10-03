import { TooltipTourContext } from "@contexts/TooltipTourContext";
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
  const tooltipTourStore = useLateInitContext(TooltipTourContext);
  const { isShown, onClose } = tooltipTourStore.tooltipState(stepId);
  return <Tooltip isShown={isShown} onClose={onClose} {...props} />;
};

export default observer(TourTooltip);
