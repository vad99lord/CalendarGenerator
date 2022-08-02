import { SplitLayout } from "@vkontakte/vkui";
import { ChildrenProps } from "../utils/types";

type AppLayoutProps = ChildrenProps;

const AppLayout = ({ children }: AppLayoutProps) => {
  return <SplitLayout>{children}</SplitLayout>;
};

export default AppLayout;
