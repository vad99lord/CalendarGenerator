import { SplitCol, View } from "@vkontakte/vkui";
import { useCallback, useMemo, useState } from "react";
import { PickerDate } from "../components/BirthdayPicker";
import useCheckedUsersState from "../hooks/useCheckedUsersState";
import useNavigationStack from "../hooks/useNavigationStack";
import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import CalendarGenerator from "./CalendarGenerator";
import EditDates from "./EditDates";
import Friends from "./Friends";
import SelectedUsers from "./SelectedUsers";

enum USERS_PICKER_PANELS {
  FRIENDS = "friends",
  EDIT_DATES = "edit_dates",
  GENERATE_CALENDAR = "generate_calendar",
  SELECTED_USERS = "selected_users",
}

const UsersPicker = () => {
  const {
    currentEntry: activePanel,
    next: onNextPanel,
    back: onBackPanel,
  } = useNavigationStack<string>();

  const checkedUsersState = useCheckedUsersState();
  const {
    state: checkedState,
    removeUserCheck,
    setUsersCheckChanged,
  } = checkedUsersState;
  const [usersToAddDates, setUsersToAddDates] = useState<UserModel[]>(
    []
  );
  const checkedUsers = useMemo(
    () => Object.values(checkedState),
    [checkedState]
  );

  const setEditDatesPanel = useCallback(() => {
    onNextPanel(USERS_PICKER_PANELS.EDIT_DATES);
    setUsersToAddDates(
      checkedUsers.filter((user) => user.birthday === undefined)
    );
  }, [checkedUsers, onNextPanel]);

  const setGenerateCalendarPanel = useCallback(() => {
    onNextPanel(USERS_PICKER_PANELS.GENERATE_CALENDAR);
  }, [onNextPanel]);

  const onOpenCheckedUsers = useCallback(() => {
    onNextPanel(USERS_PICKER_PANELS.SELECTED_USERS);
  }, [onNextPanel]);

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
  console.log(activePanel);
  return (
    <SplitCol>
      <View activePanel={activePanel ?? USERS_PICKER_PANELS.FRIENDS}>
        <Friends
          id={USERS_PICKER_PANELS.FRIENDS}
          checkedFriends={checkedUsersState}
          onNextClick={setEditDatesPanel}
          onOpenChecked={onOpenCheckedUsers}
        />
        <EditDates
          id={USERS_PICKER_PANELS.EDIT_DATES}
          usersWithoutDates={checkedUsersWithoutDates}
          onUserRemove={onUserRemove}
          onUserDateChange={onUserDateChange}
          onNextClick={setGenerateCalendarPanel}
        />
        <CalendarGenerator
          id={USERS_PICKER_PANELS.GENERATE_CALENDAR}
          users={checkedUsers}
        />
        <SelectedUsers
          id={USERS_PICKER_PANELS.SELECTED_USERS}
          selectedUsers={checkedUsers}
          onUserRemove={onUserRemove}
          onBackClick={onBackPanel}
        />
      </View>
    </SplitCol>
  );
};

export default UsersPicker;
