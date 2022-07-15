import { Group, List, Panel, SplitCol, View } from "@vkontakte/vkui";
import { useContext, useState } from "react";
import User from "../../components/User";
import { LaunchParamsContext } from "../../contexts/LaunchParamsContext";
import useAsyncEffect from "../../hooks/useAsyncEffect";
import userApiToUser from "../../network/models/User/userApiToUser";
import { UserModel } from "../../network/models/User/UserModel";
import { fetchVkApi } from "../../network/vk/fetchVkApi";
import { fetchVkBridge } from "../../network/vk/fetchVkBridge";

const Users = () => {
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<UserModel[]>([]);
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
        //TODO extract to typed const somehow
        fields: "bdate,photo_100,photo_200,photo_max",
      },
      token
    );
    if (!isError) {
      console.log(users);
      const modelUsers = users.items?.map(userApiToUser) ?? [];
      setUsers(modelUsers);
    }
  }, [token]);
  const userItems = users.map((user) => (
    <User
      key={user.id}
      user={user}
      disabled={false}
      checked={false}
    />
  ));
  return (
    <SplitCol>
      <View activePanel="panel">
        <Panel id="panel">
          <Group>
            <List>{userItems}</List>
          </Group>
        </Panel>
      </View>
    </SplitCol>
  );
};

export default Users;
