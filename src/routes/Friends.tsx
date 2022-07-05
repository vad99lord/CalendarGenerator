import {
  Group,
  List,
  Panel,
  Search,
  SplitCol,
  Text,
  View,
} from "@vkontakte/vkui";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import User from "../components/User";
import { LaunchParamsContext } from "../contexts/LaunchParamsContext";
import { TokenContext } from "../contexts/TokenContext";
import useAsyncEffect from "../hooks/useAsyncEffect";
import useSearchState from "../hooks/useSearchState";
import userApiToUser from "../network/models/User/userApiToUser";
import { UserModel } from "../network/models/User/UserModel";
import { fetchVkApi } from "../network/vk/fetchVkApi";

const Friends = () => {
  console.log("FRIENDS RENDER");
  const launchParams = useContext(LaunchParamsContext);
  const token = useContext(TokenContext);
  const [friends, setFriends] = useState<UserModel[]>([]);
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();

  useAsyncEffect(async () => {
    console.log(
      "friends fetch",
      debouncedSearchText,
      token,
      launchParams
    );
    if (!token || !launchParams) return;
    const { data: friends, isError } = await fetchVkApi(
      "friends.search",
      {
        user_id: launchParams.vk_user_id,
        q: debouncedSearchText,
        count: 50,
        offset: 0,
        //TODO extract to typed const somehow
        fields: "bdate,photo_100,photo_200,photo_max",
      },
      token
    );
    if (!isError) {
      console.log(friends);
      const modelFriends = friends.items?.map(userApiToUser) ?? [];
      setFriends(modelFriends);
    }
  }, [token, launchParams, debouncedSearchText]);
  const userItems = friends.map((user) => (
    <User key={user.id} user={user} />
  ));
  return (
    <SplitCol>
      <View activePanel="panel">
        <Panel id="panel">
          <Group>
            <Search
              value={searchText}
              onChange={onSearchChange}
              after={null}
            />
            {userItems.length ? (
              <List>{userItems}</List>
            ) : (
              <Text
                weight="1"
                style={{ margin: "24px 0", textAlign: "center" }}
              >
                Результатов не найдено
              </Text>
            )}
          </Group>
        </Panel>
      </View>
    </SplitCol>
  );
};

export default Friends;
