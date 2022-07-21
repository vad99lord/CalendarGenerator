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
  Switch,
} from "@vkontakte/vkui";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import User, { isUserSelectionEnabled } from "../components/User";
import { LaunchParamsContext } from "../contexts/LaunchParamsContext";
import { TokenContext } from "../contexts/TokenContext";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { CheckedUsers } from "../hooks/useCheckedUsersState";
import useSearchState from "../hooks/useSearchState";
import useSimpleCheckBoxState from "../hooks/useSimpleCheckBoxState";
import userApiToUser from "../network/models/User/userApiToUser";
import { UserModel } from "../network/models/User/UserModel";
import { fetchVkApi } from "../network/vk/fetchVkApi";
import { isEmptyArray } from "../utils/utils";

type SelectableUser = {
  user: UserModel;
  isSelectable: boolean;
};

export type FriendsProps = {
  id: string;
  checkedFriends: CheckedUsers;
  onNextClick: () => void;
};

const Friends = ({
  checkedFriends: {
    state: checkedState,
    count: checkedCount,
    onUserCheckChanged: onFriendCheckChanged,
    setUsersCheckChanged: setFriendsCheckChanged,
  },
  id : panelId,
  onNextClick,
}: FriendsProps) => {
  
  const launchParams = useContext(LaunchParamsContext);
  const token = useContext(TokenContext);
  const [debouncedSearchText, searchText, onSearchChange] =
    useSearchState();
  const [isManualEdit, setIsManualEdit] =
    useSimpleCheckBoxState(false);

  const [friends, setFriends] = useState<UserModel[]>([]);

  const selectableFriends = useMemo<SelectableUser[]>(
    () =>
      friends.map((user) => ({
        user,
        isSelectable: isManualEdit || isUserSelectionEnabled(user),
      })),
    [friends, isManualEdit]
  );
  const enabledFriends = useMemo(
    () =>
      selectableFriends
        .filter((it) => it.isSelectable)
        .map(({ user }) => user),
    [selectableFriends]
  );
  const disabledFriends = useMemo(
    () =>
      selectableFriends
        .filter((it) => !it.isSelectable)
        .map(({ user }) => user),
    [selectableFriends]
  );

  const areAllSelected = useMemo(
    () => enabledFriends.every(({ id }) => checkedState[id]),
    [checkedState, enabledFriends]
  );

  const onSelectAllChanged = useCallback(() => {
    if (!areAllSelected) {
      setFriendsCheckChanged(true, enabledFriends);
    } else {
      setFriendsCheckChanged(false, enabledFriends);
    }
  }, [areAllSelected, enabledFriends, setFriendsCheckChanged]);

  useEffect(() => {
    if (isManualEdit) return;
    if (isEmptyArray(disabledFriends)) return;
    setFriendsCheckChanged(false, disabledFriends);
  }, [disabledFriends, isManualEdit, setFriendsCheckChanged]);

  console.log("FRIENDS RENDER", {
    areAllSelected,
    isManualEdit,
    checkedState,
  });

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
      console.log(JSON.stringify(friends));
      const modelFriends = friends.items?.map(userApiToUser) ?? [];
      setFriends(modelFriends);
    }
  }, [token, launchParams, debouncedSearchText]);

  const userItems = selectableFriends.map(
    ({ user, isSelectable }) => (
      <User
        key={user.id}
        user={user}
        checked={Boolean(checkedState[user.id])}
        disabled={!isSelectable}
        onUserCheckChanged={onFriendCheckChanged}
      />
    )
  );

  return (
    <Panel id={panelId}>
      <PanelHeader separator={false}>Стартовый экран</PanelHeader>
      <Group>
        <Search
          value={searchText}
          onChange={onSearchChange}
          after={null}
        />
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
              disabled={checkedCount === 0}
              onClick={onNextClick}
            >
              Далее
            </Button>
          </Div>
        </FixedLayout>
      </Group>
    </Panel>
  );
};

export default Friends;
