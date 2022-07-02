import vkBridge, {
  AppearanceType,
  VKBridge,
  VKBridgeSubscribeHandler
} from "@vkontakte/vk-bridge";
import { useEffect, useState } from "react";

const useAppearance = (bridge: VKBridge = vkBridge) => {
  const [appearance, setAppearance] =
    useState<AppearanceType>("light");
  useEffect(() => {
    const updateAppAppearance: VKBridgeSubscribeHandler = ({
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
    bridge.subscribe(updateAppAppearance);
    return () => {
      bridge.unsubscribe(updateAppAppearance);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return appearance;
};

export default useAppearance;
