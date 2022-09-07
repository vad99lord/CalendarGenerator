import SelectableUser from "@components/User/SelectableUser";
import useLocalStore from "@hooks/useLocalStore";
import useVkApiFetchStore from "@hooks/useVkApiFetchStore";
import {
  Footer,
  Group,
  List,
  Pagination,
  Search,
} from "@vkontakte/vkui";
import { Observer, observer } from "mobx-react-lite";
import UsersPaginationStore from "./UsersPaginationStore";

type UsersPaginationProps = {};

const UsersPagination = ({}: UsersPaginationProps) => {
  const fetchStore = useVkApiFetchStore("PaginateFriendsByQuery");
  const usersStore = useLocalStore(UsersPaginationStore, fetchStore);

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
      <Observer>
        {() => (
          <Search
            value={usersStore.query}
            onChange={usersStore.onSearchTextChange}
            after={null}
          />
        )}
      </Observer>
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
