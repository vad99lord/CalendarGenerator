import { SplitCol, View } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import useLocalStore from "../hooks/useLocalStore";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import { NonEmptyNavStackStore } from "../stores/NavigationStackStore";
import UsersPickerStore from "../stores/UsersPickerStore";
import CalendarGenerator from "./CalendarGenerator";
import ChooseUsers, { ChooseUsersTabs } from "./ChooseUsers";
import EditDates from "./EditDates";
import SelectedUsers from "./SelectedUsers";

const UsersPickerPanels = {
  ChooseUsers: "choose_users",
  EditDates: "edit_dates",
  GenerateCalendar: "generate_calendar",
  SelectedUsers: "selected_users",
} as const;

type UsersPickerPanelsIds =
  typeof UsersPickerPanels[keyof typeof UsersPickerPanels];
type PanelNavState<id extends UsersPickerPanelsIds, State> = Record<
  id,
  State
>;

export type PanelNavigationState = PanelNavState<
  "choose_users",
  { activeTab: ChooseUsersTabs }
>;
export type ViewNavigation = {
  activePanel: UsersPickerPanelsIds;
  panelsState: PanelNavigationState;
};

const UsersPicker = () => {
  console.log("UsersPicker RENDER");
  const checkedUsersStore = useLocalStore(CheckedUsersStore);
  const navStackStore = useLocalStore(
    NonEmptyNavStackStore<ViewNavigation>,
    {
      activePanel: "choose_users",
      panelsState: {
        choose_users: {
          activeTab: "FRIENDS",
        },
      },
    }
  );
  const {
    currentEntry: { activePanel, panelsState },
  } = navStackStore;
  const usersPickerStore = useLocalStore(
    UsersPickerStore,
    checkedUsersStore,
    navStackStore
  );
  console.log({ navState: navStackStore.currentEntry });
  return (
    <SplitCol>
      <View activePanel={activePanel}>
        <ChooseUsers
          nav={UsersPickerPanels.ChooseUsers}
          checkedUsersStore={checkedUsersStore}
          onNextClick={usersPickerStore.setEditDatesPanel}
          onOpenChecked={usersPickerStore.onOpenCheckedUsers}
          onTabChange={usersPickerStore.onChooseUserTabChange}
          selectedTab={panelsState["choose_users"].activeTab}
        />
        <EditDates
          nav={UsersPickerPanels.EditDates}
          checkedUsersStore={checkedUsersStore}
          onUserRemove={checkedUsersStore.uncheck}
          onUserDateChange={usersPickerStore.onUserDateChange}
          onNextClick={usersPickerStore.setGenerateCalendarPanel}
        />
        <CalendarGenerator
          nav={UsersPickerPanels.GenerateCalendar}
          checkedUsersStore={checkedUsersStore}
        />
        <SelectedUsers
          nav={UsersPickerPanels.SelectedUsers}
          checkedUsersStore={checkedUsersStore}
          onAllUsersRemove={checkedUsersStore.clear}
          onUserRemove={checkedUsersStore.uncheck}
          onBackClick={navStackStore.back}
        />
      </View>
    </SplitCol>
  );
};

export default observer(UsersPicker);
