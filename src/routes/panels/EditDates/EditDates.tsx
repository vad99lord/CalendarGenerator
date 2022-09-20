import { PickerDate } from "@components/BirthdayPicker/BirthdayPicker";
import BottomButton from "@components/BottomButton/BottomButton";
import UserEditBirthday from "@components/User/UserEditBirthday";
import useLocalStore from "@hooks/useLocalStore";
import { UserID } from "@network/models/User/BaseUserModel";
import { UserModel } from "@network/models/User/UserModel";
import {
  NavActionsProps,
  NavElementId,
} from "@routes/types/navProps";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import {
  Button,
  Div,
  Group,
  List,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Text,
} from "@vkontakte/vkui";
import { when } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import { useEffect } from "react";
import EditDatesStore from "./EditDatesStore";

interface EditDatesProps extends NavElementId, NavActionsProps {
  checkedUsersStore: ICheckedUsersStore;
  onUserRemove: (userId: UserID) => void;
  onUserDateChange: (date: PickerDate, user: UserModel) => void;
}

const EditDates = ({
  checkedUsersStore,
  nav: panelId,
  onUserRemove,
  onUserDateChange,
  onNextClick,
  onBackClick,
}: EditDatesProps) => {
  const editDatesStore = useLocalStore(
    EditDatesStore,
    checkedUsersStore
  );
  console.log("EditDates render");

  const editDatesItems = editDatesStore.currentUsers.map((user) => (
    <UserEditBirthday
      key={user.id}
      user={user}
      onDateChange={onUserDateChange}
      onRemoveUser={onUserRemove}
    />
  ));

  useEffect(() => {
    return when(
      () => editDatesStore.currentUsers.length === 0,
      () => onNextClick()
    );
  }, [editDatesStore, onNextClick]);

  return (
    <Panel id={panelId}>
      <PanelHeader
        separator={false}
        before={<PanelHeaderBack onClick={onBackClick} />}
      >
        Добавление недостающих дат
      </PanelHeader>
      <Div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text>
          Пользователей без дней рождения:{" "}
          {editDatesStore.currentUsersWithoutBirthday.length}
        </Text>
        <Button
          size="m"
          appearance="negative"
          onClick={editDatesStore.onRemoveAllCurrentUsers}
        >
          Очистить все
        </Button>
      </Div>
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
