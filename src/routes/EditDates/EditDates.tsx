import { PickerDate } from "@components/BirthdayPicker/BirthdayPicker";
import BottomButton from "@components/BottomButton/BottomButton";
import UserEditBirthday from "@components/User/UserEditBirthday";
import useLocalStore from "@hooks/useLocalStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { Group, List, Panel, PanelHeader } from "@vkontakte/vkui";
import { Observer, observer } from "mobx-react-lite";
import { UserID } from "../../network/models/User/BaseUserModel";
import { UserModel } from "../../network/models/User/UserModel";
import { NavElementId } from "../types";
import EditDatesStore from "./EditDatesStore";

interface EditDatesProps extends NavElementId {
  checkedUsersStore: ICheckedUsersStore;
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
      <Observer>
        {() => (
          <BottomButton
            onClick={onNextClick}
            disabled={!editDatesStore.allDatesProvided}
          >
            Далее
          </BottomButton>
        )}
      </Observer>
    </Panel>
  );
};

export default observer(EditDates);
