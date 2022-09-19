import { createLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import IPopoutStore from "@stores/PopoutStore/IPopoutStore";
import PopoutStore from "@stores/PopoutStore/PopoutStore";
import { ChildrenProps } from "@utils/types";

export const PopoutContext = createLateInitContext<IPopoutStore>();

type PopoutProviderProps = ChildrenProps;

export const PopoutProvider = ({ children }: PopoutProviderProps) => {
  const popoutStore: IPopoutStore = useLocalStore(PopoutStore);
  return (
    <PopoutContext.Provider value={popoutStore}>
      {children}
    </PopoutContext.Provider>
  );
};
