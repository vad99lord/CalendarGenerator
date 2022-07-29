import { SplitCol, View } from "@vkontakte/vkui";
import { useMemo } from "react";
import { useCallback, useState } from "react";
import { PickerDate } from "../components/BirthdayPicker";
import useCheckedUsersState from "../hooks/useCheckedUsersState";
import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import CalendarGenerator from "./CalendarGenerator";
import EditDates from "./EditDates";
import Friends from "./Friends";

enum USERS_PICKER_PANELS {
  FRIENDS = "friends",
  EDIT_DATES = "edit_dates",
  GENERATE_CALENDAR = "generate_calendar",
}

const UsersPicker = () => {
  const [activePanel, setActivePanel] = useState(
    USERS_PICKER_PANELS.FRIENDS
  );

  const checkedUsers = useCheckedUsersState();
  const {
    state: checkedState,
    removeUserCheck,
    setUsersCheckChanged,
  } = checkedUsers;
  const [usersToAddDates, setUsersToAddDates] = useState<UserModel[]>(
    []
  );

  const setEditDatesPanel = useCallback(() => {
    setActivePanel(USERS_PICKER_PANELS.EDIT_DATES);
    setUsersToAddDates(
      Object.values(checkedState).filter(
        (user) => user.birthday === undefined
      )
    );
  }, [checkedState]);

  const setGenerateCalendarPanel = useCallback(() => {
    setActivePanel(USERS_PICKER_PANELS.GENERATE_CALENDAR);
  }, []);

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

  return (
    <SplitCol>
      <View activePanel={activePanel}>
        <Friends
          id={USERS_PICKER_PANELS.FRIENDS}
          checkedFriends={checkedUsers}
          onNextClick={setEditDatesPanel}
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
          users={Object.values(checkedState)}
        />
      </View>
    </SplitCol>
  );
};

export default UsersPicker;
