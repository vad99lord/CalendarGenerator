import { Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import { useMemo } from "react";
import { PickerDate } from "../components/BirthdayPicker/BirthdayPicker";
import BottomButton from "../components/BottomButton/BottomButton";
import UserEditBirthday from "../components/User/UserEditBirthday";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import { NavElementId } from "./ChooseUsers";

interface EditDatesProps extends NavElementId {
  usersWithoutDates: UserModel[];
  onUserRemove: (userId: UserID) => void;
  onUserDateChange: (date: PickerDate, user: UserModel) => void;
  onNextClick: () => void;
}

const EditDates = ({
  usersWithoutDates,
  nav: panelId,
  onUserRemove,
  onUserDateChange,
  onNextClick,
}: EditDatesProps) => {
  const allDatesProvided = useMemo(
    () => usersWithoutDates.every((user) => Boolean(user.birthday)),
    [usersWithoutDates]
  );
  console.log({ allDatesProvided, usersWithoutDates });

  const editDatesItems = usersWithoutDates.map((user) => (
    <UserEditBirthday
      key={user.id}
      user={user}
      onDateChange={onUserDateChange}
      onRemoveUser={onUserRemove}
      
    />
  ));

  return (
    <Panel id={panelId}>
      <PanelHeader>Добавление недостающих дат</PanelHeader>
      <Group>
        <List>{editDatesItems}</List>
      </Group>
      <BottomButton
        onClick={onNextClick}
        disabled={!allDatesProvided}
      >
        Далее
      </BottomButton>
    </Panel>
  );
};

export default EditDates;
