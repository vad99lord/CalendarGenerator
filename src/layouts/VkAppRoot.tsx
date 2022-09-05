import useAppearance from "@hooks/useAppearance";
import { ChildrenProps } from "@utils/types";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
} from "@vkontakte/vkui";

type VkAppRootProps = ChildrenProps;

const VkAppRoot = ({ children }: VkAppRootProps) => {
  const appearance = useAppearance();
  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>{children}</AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default VkAppRoot;
