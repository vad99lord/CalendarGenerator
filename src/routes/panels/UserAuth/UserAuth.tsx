import {
  Button,
  Div,
  Group,
  Headline,
  Panel,
  Spinner,
  Title
} from "@vkontakte/vkui";

import { AuthContext } from "@contexts/AuthContext";
import { useLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import { vkBridgeErrorToString } from "@network/vk/VkErrorLogger";
import { LoadState } from "@stores/FetchStores/LoadState";
import { when } from "mobx";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import { NavActionsProps, NavElementId } from "../../types/navProps";
import UserAuthStore from "./UserAuthStore";

interface UserAuthProps
  extends NavElementId,
    Pick<NavActionsProps, "onNextClick"> {}

const UserAuth = ({ onNextClick, nav: panelId }: UserAuthProps) => {
  const authStore = useLateInitContext(AuthContext);
  const userAuthStore = useLocalStore(UserAuthStore, authStore);
  console.log("UserAuth render");

  useEffect(() => {
    userAuthStore.auth();
  }, [userAuthStore]);

  useEffect(() => {
    return when(
      () => Boolean(authStore.data),
      () => onNextClick()
    );
  }, [authStore, onNextClick]);

  const getContent = useCallback(() => {
    switch (userAuthStore.loadState) {
      case LoadState.Loading: {
        return <Spinner size="large" />;
      }
      case LoadState.Error: {
        const errorTitle = userAuthStore.userDeniedAuth
          ? "Вы должны дать разрешения!"
          : "Произошла ошибка(";
        return (
          <Group>
            <Div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Title level="3">{errorTitle}</Title>
              <Headline level="2">
                {vkBridgeErrorToString(userAuthStore.error)}
              </Headline>
              <Button onClick={userAuthStore.auth}>
                Попробовать еще раз
              </Button>
            </Div>
          </Group>
        );
      }
      default: {
        return null;
      }
    }
  }, [userAuthStore]);

  return <Panel id={panelId}>{getContent()}</Panel>;
};

export default observer(UserAuth);
