import { createLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import ITooltipTourStore from "@stores/TooltipTourStore/ITooltipTourStore";
import TooltipTourStore from "@stores/TooltipTourStore/TooltipTourStore";
import { ChildrenProps } from "@utils/types";

export const TooltipTourContext =
  createLateInitContext<ITooltipTourStore>();

interface TooltipTourContextProps extends ChildrenProps {
  tooltipsCount: number;
}

export const TooltipTourProvider = ({
  children,
  tooltipsCount,
}: TooltipTourContextProps) => {
  const tooltipTourStore: ITooltipTourStore = useLocalStore(
    TooltipTourStore,
    tooltipsCount
  );
  return (
    <TooltipTourContext.Provider value={tooltipTourStore}>
      {children}
    </TooltipTourContext.Provider>
  );
};
