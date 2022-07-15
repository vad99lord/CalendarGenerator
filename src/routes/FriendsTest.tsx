import {
  Button,
  Checkbox,
  Div,
  FixedLayout,
  Footer,
  FormItem,
  Group,
  List,
  Panel,
  PanelHeader,
  Search,
  SimpleCell,
  SizeType,
  SplitCol,
  Switch,
  View,
} from "@vkontakte/vkui";
import UserTest from "../components/UserTest";
import useCheckedUsersState from "../hooks/useCheckedUsersState";
import useSimpleCheckBoxState from "../hooks/useSimpleCheckBoxState";
import {
  DEFAULT_USER_PHOTOS,
  UserModel,
} from "../network/models/User/UserModel";

const mockUser: UserModel = {
  id: 1,
  lastName: "last",
  firstName: "first",
  ...DEFAULT_USER_PHOTOS,
};

const friends = Array.apply(null, Array(10)).map((_, ind) => ({
  ...mockUser,
  id: ind,
}));

const FriendsTest = () => {
  const [isManualEdit, setIsManualEdit] =
    useSimpleCheckBoxState(false);
  const [areAllSelected, onSelectAllChanged] =
    useSimpleCheckBoxState(false);

  // const [checkFriends, setCheckedFriends] = useState<boolean[]>([]);

  const [
    checkedFriends,
    _,
    setFriendsCheckChanged,
    onFriendCheckChanged,
  ] = useCheckedUsersState();
  // const onFriendCheck = useCallback(
  //   (user: UserModel) => {
  //     if (checkFriends[user.id]) {
  //       checkFriends[user.id] = false;
  //     } else {
  //       checkFriends[user.id] = true;
  //     }
  //     setCheckedFriends([...checkFriends]);
  //   },
  //   [checkFriends]
  // );

  const userItems = friends.map((user) => (
    <UserTest
      key={user.id}
      user={user}
      onUserCheckChanged={onFriendCheckChanged}
      checked={Boolean(checkedFriends[user.id])}
    />
  ));

  return (
    <SplitCol>
      <View activePanel="panel">
        <Panel id="panel">
          <PanelHeader separator={false}>Стартовый экран</PanelHeader>
          <Group>
            <Search value="test" after={null} />
            <FormItem>
              <Checkbox
                checked={areAllSelected}
                onChange={onSelectAllChanged}
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
            <FixedLayout filled vertical="bottom">
              <Div>
                <Button
                  size="l"
                  appearance="accent"
                  stretched
                  disabled={false}
                >
                  Далее
                </Button>
              </Div>
            </FixedLayout>
          </Group>
        </Panel>
      </View>
    </SplitCol>
  );
};

export default FriendsTest;
