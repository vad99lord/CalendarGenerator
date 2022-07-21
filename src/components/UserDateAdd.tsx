import { Avatar, Cell } from "@vkontakte/vkui";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";
import { getPhotoUrl } from "./User";

import { useCallback } from "react";
import BirthdayPicker, {
  PickerDate
} from "./BirthdayPicker";

type UserDateAddProps = {
  user: UserModel;
  removeFromList?: (id: UserID) => void;
  onDateChange?: (newDate: PickerDate, id: UserModel) => void;
};

const UserDateAdd = ({
  user,
  removeFromList,
  onDateChange,
}: UserDateAddProps) => {
  const onUserDateChange = useCallback(
    (newDate: PickerDate) => {
      onDateChange?.(newDate, user);
    },
    [onDateChange, user]
  );
  return (
    <Cell
      before={<Avatar size={48} src={getPhotoUrl(user)} />}
      mode="removable"
      onRemove={() => removeFromList?.(user.id)}
      indicator={
        <BirthdayPicker
          acceptYear={false}
          onDateChange={onUserDateChange}
        />
      }
    >
      {user.firstName} {user.lastName}
    </Cell>
  );
};

export default UserDateAdd;
