import { SplitLayout } from "@vkontakte/vkui";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <SplitLayout>
      <Outlet />
    </SplitLayout>
  );
};

export default AppLayout;
