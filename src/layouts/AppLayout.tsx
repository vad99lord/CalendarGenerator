import { ChildrenProps } from "@utils/types";
import { SplitLayout } from "@vkontakte/vkui";

type AppLayoutProps = ChildrenProps;

const AppLayout = ({ children }: AppLayoutProps) => {
  return <SplitLayout>{children}</SplitLayout>;
};

export default AppLayout;
