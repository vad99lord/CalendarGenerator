import { Panel, SplitCol, Title, View } from "@vkontakte/vkui";
import { useContext, useState } from "react";
import { LaunchParamsContext } from "../../contexts/LaunchParamsContext";
import useAsyncEffect from "../../hooks/useAsyncEffect";
import {
  fetchVkApi,
  isValidResponse
} from "../../utils/network/fetchVkApi";

const Users = () => {
  const [token, setToken] = useState<string>("");
  const launchParams = useContext(LaunchParamsContext);

  useAsyncEffect(async () => {
    if (!launchParams) return;
    const tokenResponse = await fetchVkApi("VKWebAppGetAuthToken", {
      app_id: launchParams.vk_app_id,
      scope: "friends",
    });
    if (isValidResponse(tokenResponse)) {
      setToken(tokenResponse.access_token);
    }
  }, [launchParams]);
  return (
    <SplitCol>
      <View activePanel="panel">
        <Panel id="panel">
          <Title level="1">Token is {token}</Title>
        </Panel>
      </View>
    </SplitCol>
  );
};

export default Users;
