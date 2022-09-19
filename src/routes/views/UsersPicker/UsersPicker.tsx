import useLocalStore from "@hooks/useLocalStore";
import useScope from "@hooks/useScope";
import ChooseUsers from "@routes/panels/ChooseUsers/ChooseUsers";
import EditDates from "@routes/panels/EditDates/EditDates";
import SelectedUsers from "@routes/panels/SelectedUsers/SelectedUsers";
import UserAuth from "@routes/panels/UserAuth/UserAuth";
import { BirthdaysCalendarPanels } from "@routes/types/navigation/panels";
import { BirthdaysCalendarRootNavigation } from "@routes/types/navigation/root";
import { NavElementId } from "@routes/types/navProps";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { View } from "@vkontakte/vkui";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import UsersPickerStore from "./UsersPickerStore";

interface UsersPickerProps extends NavElementId {
  checkedUsersStore: ICheckedUsersStore;
  navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>;
}

const UsersPicker = ({
  checkedUsersStore,
  navStackStore,
}: UsersPickerProps) => {
  console.log("UsersPicker RENDER");
  const usersPickerScope = useScope();
  const usersPickerPanels = computed(
    () => navStackStore.currentEntry.viewsState["users_picker"]
  ).get();
  const usersPickerStore = useLocalStore(
    UsersPickerStore,
    checkedUsersStore,
    navStackStore
  );
  return (
    <View activePanel={usersPickerPanels.activePanel}>
      <UserAuth
        nav={BirthdaysCalendarPanels.UserAuth}
        onNextClick={usersPickerStore.setChooseUsersPanel}
      />
      <ChooseUsers
        nav={BirthdaysCalendarPanels.ChooseUsers}
        checkedUsersStore={checkedUsersStore}
        onNextClick={usersPickerStore.setEditDatesPanel}
        onOpenChecked={usersPickerStore.onOpenCheckedUsers}
        onTabChange={usersPickerStore.onChooseUserTabChange}
        selectedTab={
          usersPickerPanels.panelsState["choose_users"].activeTab
        }
        scopeId={usersPickerScope}
      />
      <EditDates
        nav={BirthdaysCalendarPanels.EditDates}
        checkedUsersStore={checkedUsersStore}
        onUserRemove={checkedUsersStore.uncheck}
        onUserDateChange={usersPickerStore.onUserDateChange}
        onNextClick={usersPickerStore.setGenerateCalendarPanel}
        onBackClick={navStackStore.back}
      />
      <SelectedUsers
        nav={BirthdaysCalendarPanels.SelectedUsers}
        checkedUsersStore={checkedUsersStore}
        onAllUsersRemove={checkedUsersStore.clear}
        onUserRemove={checkedUsersStore.uncheck}
        onBackClick={navStackStore.back}
      />
    </View>
  );
};

export default observer(UsersPicker);
