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

enum USERS_PICKER_PANELS {
  CHOOSE_USERS = "choose_users",
  EDIT_DATES = "edit_dates",
  GENERATE_CALENDAR = "generate_calendar",
  SELECTED_USERS = "selected_users",
}

export type PanelNavigation =
  | {
      panelId: Exclude<
        USERS_PICKER_PANELS,
        USERS_PICKER_PANELS.CHOOSE_USERS
      >;
    }
  | {
      panelId: Extract<
        USERS_PICKER_PANELS,
        USERS_PICKER_PANELS.CHOOSE_USERS
      >;
      activeTab: ChooseUsersTabs;
    };

const UsersPicker = () => {
  const {
    currentEntry: activePanel,
    next: onNextPanel,
    back: onBackPanel,
    replace: onReplacePanel,
  } = useNavigationStack<PanelNavigation>({
    panelId: USERS_PICKER_PANELS.CHOOSE_USERS,
    activeTab: "FRIENDS",
  });

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
    onNextPanel({ panelId: USERS_PICKER_PANELS.EDIT_DATES });
    setUsersToAddDates(
      checkedUsers.filter((user) => user.birthday === undefined)
    );
  }, [checkedUsers, onNextPanel]);

  const setGenerateCalendarPanel = useCallback(() => {
    onNextPanel({ panelId: USERS_PICKER_PANELS.GENERATE_CALENDAR });
  }, [onNextPanel]);

  const onOpenCheckedUsers = useCallback(() => {
    onNextPanel({ panelId: USERS_PICKER_PANELS.SELECTED_USERS });
  }, [onNextPanel]);

  const onChooseUserTabChange = useCallback(
    (activeTab: ChooseUsersTabs) => {
      onReplacePanel({
        panelId: USERS_PICKER_PANELS.CHOOSE_USERS,
        activeTab,
      });
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
  console.log({ activePanel });
  return (
    <SplitCol>
      <View
        activePanel={
          activePanel.panelId
        }
      >
        <ChooseUsers
          nav={USERS_PICKER_PANELS.CHOOSE_USERS}
          checkedFriends={checkedUsersState}
          onNextClick={setEditDatesPanel}
          onOpenChecked={onOpenCheckedUsers}
          onTabChange={onChooseUserTabChange}
          selectedTab={
            activePanel?.panelId === USERS_PICKER_PANELS.CHOOSE_USERS
              ? activePanel.activeTab
              : undefined
          }
        />
        <EditDates
          nav={USERS_PICKER_PANELS.EDIT_DATES}
          usersWithoutDates={checkedUsersWithoutDates}
          onUserRemove={onUserRemove}
          onUserDateChange={onUserDateChange}
          onNextClick={setGenerateCalendarPanel}
        />
        <CalendarGenerator
          nav={USERS_PICKER_PANELS.GENERATE_CALENDAR}
          users={checkedUsers}
        />
        <SelectedUsers
          nav={USERS_PICKER_PANELS.SELECTED_USERS}
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
