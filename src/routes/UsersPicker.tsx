import { SplitCol, View } from "@vkontakte/vkui";
import { useCallback } from "react";
import { PickerDate } from "../components/BirthdayPicker/BirthdayPicker";
import useLocalStore from "../hooks/useLocalStore";
import useNavigationStack from "../hooks/useNavigationStack";
import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserModel } from "../network/models/User/UserModel";
import CheckedUsersStore from "../stores/CheckedUsersStore";
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

const getPanelState = <Id extends keyof PanelNavigationState>(
  panelId: Id,
  navState: ViewNavigation
): PanelNavigationState[Id] => {
  return navState.panelsState[panelId];
};

const UsersPicker = () => {
  const {
    currentEntry: navState,
    next: onNextPanel,
    back: onBackPanel,
    replace: onReplacePanel,
  } = useNavigationStack<ViewNavigation>({
    activePanel: "choose_users",
    panelsState: {
      choose_users: {
        activeTab: "FRIENDS",
      },
    },
  });
  console.log("UsersPicker RENDER");

  const checkedUsersStore = useLocalStore(CheckedUsersStore);

  const setEditDatesPanel = useCallback(() => {
    onNextPanel((prevState) => ({
      ...prevState,
      activePanel: "edit_dates",
    }));
  }, [onNextPanel]);

  const setGenerateCalendarPanel = useCallback(() => {
    onNextPanel((prevState) => ({
      ...prevState,
      activePanel: "generate_calendar",
    }));
  }, [onNextPanel]);

  const onOpenCheckedUsers = useCallback(() => {
    onNextPanel((prevState) => ({
      ...prevState,
      activePanel: "selected_users",
    }));
  }, [onNextPanel]);

  const onChooseUserTabChange = useCallback(
    (activeTab: ChooseUsersTabs) => {
      onReplacePanel((prevState) => ({
        ...prevState,
        panelsState: {
          choose_users: {
            activeTab: activeTab,
          },
        },
      }));
    },
    [onReplacePanel]
  );

  const onUserDateChange = useCallback(
    (date: PickerDate, user: UserModel) => {
      const userWithDate = { ...user, birthday: new BirthDate(date) };
      checkedUsersStore.setChecked(true, userWithDate);
    },
    [checkedUsersStore]
  );
  console.log({ navState });
  return (
    <SplitCol>
      <View activePanel={navState.activePanel}>
        <ChooseUsers
          nav={UsersPickerPanels.ChooseUsers}
          checkedUsersStore={checkedUsersStore}
          onNextClick={setEditDatesPanel}
          onOpenChecked={onOpenCheckedUsers}
          onTabChange={onChooseUserTabChange}
          selectedTab={
            getPanelState("choose_users", navState).activeTab
          }
        />
        <EditDates
          nav={UsersPickerPanels.EditDates}
          checkedUsersStore={checkedUsersStore}
          onUserRemove={checkedUsersStore.uncheck}
          onUserDateChange={onUserDateChange}
          onNextClick={setGenerateCalendarPanel}
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
          onBackClick={onBackPanel}
        />
      </View>
    </SplitCol>
  );
};
export default UsersPicker;
