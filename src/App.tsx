import bridge, {
  AppearanceType,
  VKBridgeSubscribeHandler
} from "@vkontakte/vk-bridge";
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  Panel,
  SplitCol,
  SplitLayout,
  Title,
  View
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";

const App = () => {
  const [appearance, setAppearance] =
    useState<AppearanceType>("light");

  useEffect(() => {
    const updateAppApearance: VKBridgeSubscribeHandler = ({
      detail,
    }) => {
      if (detail.type === "VKWebAppUpdateConfig") {
        const { data } = detail;
        if ("appearance" in data) {
          setAppearance(data.appearance);
        } else {
          switch (data.scheme) {
            case "bright_light":
            case "client_light":
            case "vkcom_light":
              setAppearance("light");
              break;
            case "client_dark":
            case "space_gray":
            case "vkcom_dark":
              setAppearance("dark");
              break;
          }
        }
      }
    };
    bridge.subscribe(updateAppApearance);
    return () => {
      bridge.unsubscribe(updateAppApearance);
    };
  }, []);

  return (
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout>
            <SplitCol>
              <View activePanel="panel">
                <Panel id="panel">
                  <Title level="1">Hello from pet!</Title>
                </Panel>
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
