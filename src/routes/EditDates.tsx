import { Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import { PickerDate } from "../components/BirthdayPicker/BirthdayPicker";
import BottomButton from "../components/BottomButton/BottomButton";
import UserEditBirthday from "../components/User/UserEditBirthday";
import useLocalStore from "../hooks/useLocalStore";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import EditDatesStore from "../stores/EditDatesStore";
import { NavElementId } from "./ChooseUsers";

interface EditDatesProps extends NavElementId {
  checkedUsersStore: CheckedUsersStore;
  onUserRemove: (userId: UserID) => void;
  onUserDateChange: (date: PickerDate, user: UserModel) => void;
  onNextClick: () => void;
}

const EditDates = ({
  checkedUsersStore,
  nav: panelId,
  onUserRemove,
  onUserDateChange,
  onNextClick,
}: EditDatesProps) => {
  const editDatesStore = useLocalStore(
    EditDatesStore,
    checkedUsersStore
  );

  const editDatesItems =
    editDatesStore.currentUsersWithoutBirthday.map((user) => (
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
        disabled={!editDatesStore.allDatesProvided}
      >
        Далее
      </BottomButton>
    </Panel>
  );
};

export default observer(EditDates);
