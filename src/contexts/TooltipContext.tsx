import { createLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import ITooltipTourStore from "@stores/TooltipTourStore/ITooltipTourStore";
import TooltipTourStore from "@stores/TooltipTourStore/TooltipTourStore";
import { ChildrenProps } from "@utils/types";

export const TooltipContext =
  createLateInitContext<ITooltipTourStore>();

interface TooltipContextProps extends ChildrenProps {}

export const TooltipProvider = ({
  children,
}: TooltipContextProps) => {
  const tooltipTourStore: ITooltipTourStore =
    useLocalStore(TooltipTourStore);
  return (
    <TooltipContext.Provider value={tooltipTourStore}>
      {children}
    </TooltipContext.Provider>
  );
};
