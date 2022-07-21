import { Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import { useMemo } from "react";
import { PickerDate } from "../components/BirthdayPicker";
import BottomButton from "../components/BottomButton";
import UserDateAdd from "../components/UserDateAdd";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";

type EditDatesProps = {
  id: string;
  usersWithoutDates: UserModel[];
  onUserRemove: (userId: UserID) => void;
  onUserDateChange: (date: PickerDate, user: UserModel) => void;
  onNextClick: () => void;
};

const EditDates = ({
  usersWithoutDates,
  id: panelId,
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
    <UserDateAdd
      key={user.id}
      user={user}
      onDateChange={onUserDateChange}
      removeFromList={onUserRemove}
    />
  ));

  return (
    <Panel id={panelId}>
      <PanelHeader>Добавление недостающих дат</PanelHeader>
      <Group>
        <List>{editDatesItems}</List>
      </Group>
      <BottomButton onClick={onNextClick} disabled={!allDatesProvided}>
        Далее
      </BottomButton>
    </Panel>
  );
};

export default EditDates;
