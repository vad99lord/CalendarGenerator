import { SplitCol, View } from "@vkontakte/vkui";
import { useCallback, useMemo, useState } from "react";
import { PickerDate } from "../components/BirthdayPicker/BirthdayPicker";
import useCheckedUsersState from "../hooks/useCheckedUsersState";
import useNavigationStack from "../hooks/useNavigationStack";
import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
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
    nextUpdate: onNextPanel,
    back: onBackPanel,
    replaceUpdate: onReplacePanel,
  } = useNavigationStack<ViewNavigation>({
    activePanel: "choose_users",
    panelsState: {
      choose_users: {
        activeTab: "FRIENDS",
      },
    },
  });
  console.log("UsersPicker RENDER");

  const checkedUsersState = useCheckedUsersState();
  const {
    state: checkedState,
    removeUserCheck,
    setUsersCheckChanged,
    clearCheckedUsers,
  } = checkedUsersState;
  const [usersToAddDates, setUsersToAddDates] = useState<UserModel[]>(
    []
  );
  const checkedUsers = useMemo(
    () => Object.values(checkedState),
    [checkedState]
  );

  const setEditDatesPanel = useCallback(() => {
    onNextPanel((prevState) => ({
      ...prevState,
      activePanel: "edit_dates",
    }));
    setUsersToAddDates(
      checkedUsers.filter((user) => user.birthday === undefined)
    );
  }, [checkedUsers, onNextPanel]);

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

  const checkedUsersWithoutDates = useMemo(
    () =>
      usersToAddDates
        .map((user) => checkedState[user.id])
        .filter(Boolean),
    [checkedState, usersToAddDates]
  );

  const onUserRemove = useCallback(
    (userId: UserID) => {
      removeUserCheck(userId);
    },
    [removeUserCheck]
  );

  const onUserDateChange = useCallback(
    (date: PickerDate, user: UserModel) => {
      const userWithDate = { ...user, birthday: new BirthDate(date) };
      setUsersCheckChanged(true, [userWithDate]);
    },
    [setUsersCheckChanged]
  );
  console.log({ navState });
  return (
    <SplitCol>
      <View activePanel={navState.activePanel}>
        <ChooseUsers
          nav={UsersPickerPanels.ChooseUsers}
          checkedFriends={checkedUsersState}
          onNextClick={setEditDatesPanel}
          onOpenChecked={onOpenCheckedUsers}
          onTabChange={onChooseUserTabChange}
          selectedTab={getPanelState("choose_users",navState).activeTab}
        />
        <EditDates
          nav={UsersPickerPanels.EditDates}
          usersWithoutDates={checkedUsersWithoutDates}
          onUserRemove={onUserRemove}
          onUserDateChange={onUserDateChange}
          onNextClick={setGenerateCalendarPanel}
        />
        <CalendarGenerator
          nav={UsersPickerPanels.GenerateCalendar}
          users={checkedUsers}
        />
        <SelectedUsers
          nav={UsersPickerPanels.SelectedUsers}
          selectedUsers={checkedUsers}
          onAllUsersRemove={clearCheckedUsers}
          onUserRemove={onUserRemove}
          onBackClick={onBackPanel}
        />
      </View>
    </SplitCol>
  );
};
export default UsersPicker;
