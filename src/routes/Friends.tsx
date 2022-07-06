import {
  Checkbox,
  Footer,
  FormItem,
  Group,
  List,
  Panel,
  Search,
  SimpleCell,
  SizeType,
  SplitCol,
  Switch,
  View
} from "@vkontakte/vkui";
import { useContext, useState } from "react";
import User from "../components/User";
import { LaunchParamsContext } from "../contexts/LaunchParamsContext";
import { TokenContext } from "../contexts/TokenContext";
import useAsyncEffect from "../hooks/useAsyncEffect";
import useSearchState from "../hooks/useSearchState";
import useSimpleCheckBoxState from "../hooks/useSimpleCheckBoxState";
import userApiToUser from "../network/models/User/userApiToUser";
import { UserModel } from "../network/models/User/UserModel";
import { fetchVkApi } from "../network/vk/fetchVkApi";

const Friends = () => {
  console.log("FRIENDS RENDER");
  const launchParams = useContext(LaunchParamsContext);
  const token = useContext(TokenContext);
  const [friends, setFriends] = useState<UserModel[]>([]);
  const [isSelectAll, setIsSelectAll] = useSimpleCheckBoxState(true);
  const [isManualEdit, setIsManualEdit] =
    useSimpleCheckBoxState(false);
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
        count: 20,
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
    <User
      key={user.id}
      user={user}
      forceChecked={isSelectAll}
      ignoreDisabled={isManualEdit}
    />
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
            <FormItem>
              <Checkbox
                checked={isSelectAll}
                onChange={setIsSelectAll}
              >
                Выбрать всех
              </Checkbox>
              <SimpleCell
                sizeY={SizeType.COMPACT}
                Component="label"
                after={
                  <Switch
                    checked={isManualEdit}
                    onChange={setIsManualEdit}
                  />
                }
              >
                Ручной выбор
              </SimpleCell>
            </FormItem>
            {userItems.length ? (
              <List>{userItems}</List>
            ) : (
              <Footer>Ничего не найдено</Footer>
            )}
          </Group>
        </Panel>
      </View>
    </SplitCol>
  );
};

export default Friends;
