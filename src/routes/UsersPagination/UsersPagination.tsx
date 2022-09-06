import SelectableUser from "@components/User/SelectableUser";
import useLocalStore from "@hooks/useLocalStore";
import useVkApiFetchStore from "@hooks/useVkApiFetchStore";
import { Footer, Group, List, Pagination } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import UsersPaginationStore from "./UsersPaginationStore";

type UsersPaginationProps = {};

const UsersPagination = ({}: UsersPaginationProps) => {
  const fetchStore = useVkApiFetchStore("PaginateFriends");
  const usersStore = useLocalStore(UsersPaginationStore, fetchStore);

  // console.log("UserPickerTab RENDER", {
  //   areAllUsersChecked: toJS(usersStore.areAllUsersChecked),
  //   ignoreSelectable: toJS(usersStore.ignoreSelectable),
  //   checkedState: toJS(checkedUsersStore.checked),
  // });

  const userItems = usersStore.users.map((user) => (
    <SelectableUser
      key={user.id}
      user={user}
      checked={false}
      disabled={false}
      onUserCheckChanged={() => {}}
      showBirthday
    />
  ));

  return (
    <Group>
      {userItems.length ? (
        <List style={{ marginBottom: 60 }}>{userItems}</List>
      ) : (
        <Footer>Ничего не найдено</Footer>
      )}
      <Pagination
        currentPage={usersStore.currentPage}
        onChange={usersStore.setCurrentPage}
        siblingCount={1}
        boundaryCount={1}
        totalPages={usersStore.totalPagesCount}
      />
    </Group>
  );
};

export default observer(UsersPagination);
