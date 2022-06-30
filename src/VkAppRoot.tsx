import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
} from "@vkontakte/vkui";
import { Outlet } from "react-router-dom";
import useAppearance from "./hooks/useAppearance";

const VkAppRoot = () => {
  const appearance = useAppearance();
  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <Outlet />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default VkAppRoot;
