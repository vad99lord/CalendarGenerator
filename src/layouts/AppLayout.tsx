import { PopoutContext } from "@contexts/PopoutContext";
import { useLateInitContext } from "@hooks/useLateInitContext";
import IPopoutStore from "@stores/PopoutStore/IPopoutStore";
import { ChildrenProps } from "@utils/types";
import { SplitLayout } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";

type AppLayoutProps = ChildrenProps;

const AppLayout = ({ children }: AppLayoutProps) => {
  const popoutStore: IPopoutStore = useLateInitContext(PopoutContext);
  return (
    <SplitLayout popout={popoutStore.popout}>{children}</SplitLayout>
  );
};

export default observer(AppLayout);
