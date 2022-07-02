import { UsersUserFull } from "@vkontakte/api-schema-typescript";
import { Panel, SplitCol, View } from "@vkontakte/vkui";
import { useContext, useState } from "react";
import User from "../../components/User";
import { LaunchParamsContext } from "../../contexts/LaunchParamsContext";
import useAsyncEffect from "../../hooks/useAsyncEffect";
import { fetchVkApi } from "../../network/vk/fetchVkApi";
import { fetchVkBridge } from "../../network/vk/fetchVkBridge";

const Users = () => {
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<UsersUserFull[]>([]);
  const launchParams = useContext(LaunchParamsContext);

  useAsyncEffect(async () => {
    if (!launchParams) return;
    const { data: response, isError } = await fetchVkBridge(
      "VKWebAppGetAuthToken",
      {
        app_id: launchParams.vk_app_id,
        scope: "friends",
      }
    );
    if (!isError) {
      setToken(response.access_token);
    }
  }, [launchParams]);

  useAsyncEffect(async () => {
    if (token === "") return;
    const { data: users, isError } = await fetchVkApi(
      "users.search",
      {
        q: "",
        count: 10,
        offset: 0,
        fields: "bdate",
      },
      token
    );
    if (!isError) {
      console.log(users);
      if (users.items) setUsers(users.items);
    }
  }, [token]);
  const userItems = users.map((user) => (
    <User key={user.id} user={user} />
  ));
  return (
    <SplitCol>
      <View activePanel="panel">
        <Panel id="panel">{userItems}</Panel>
      </View>
    </SplitCol>
  );
};

export default Users;
