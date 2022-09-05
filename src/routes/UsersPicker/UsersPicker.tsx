import useLocalStore from "@hooks/useLocalStore";
import CheckedUsersStore from "@stores/CheckedUsersStore/CheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { NonEmptyNavStackStore } from "@stores/NavigationStackStore/NavigationStackStore";
import { SplitCol, View } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import ICheckedUsersStore from "../../stores/CheckedUsersStore/ICheckedUsersStore";
import CalendarGenerator from "../CalendarGenerator/CalendarGenerator";
import ChooseUsers, {
  ChooseUsersTabs,
} from "../ChooseUsers/ChooseUsers";
import EditDates from "../EditDates/EditDates";
import SelectedUsers from "../SelectedUsers/SelectedUsers";
import UsersPickerStore from "./UsersPickerStore";

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
  const checkedUsersStore: ICheckedUsersStore =
    useLocalStore(CheckedUsersStore);
  const navStackStore: INonEmptyNavigationStackStore<ViewNavigation> =
    useLocalStore(NonEmptyNavStackStore<ViewNavigation>, {
      activePanel: "choose_users",
      panelsState: {
        choose_users: {
          activeTab: "FRIENDS",
        },
      },
    });
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
