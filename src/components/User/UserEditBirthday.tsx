import { SizeType } from "@vkontakte/vkui";
import { useCallback } from "react";
import { UserModel } from "../../network/models/User/UserModel";
import BirthdayPicker, {
  BirthdayPickerProps,
  PickerDate,
} from "../BirthdayPicker/BirthdayPicker";
import RemovableUser, { RemovableUserProps } from "./RemovableUser";

interface UserEditBirthdayProps
  extends RemovableUserProps,
    Pick<BirthdayPickerProps, "defaultDate"> {
  onDateChange?: (newDate: PickerDate, id: UserModel) => void;
}

const UserEditBirthday = ({
  user,
  onDateChange,
  defaultDate,
  ...props
}: UserEditBirthdayProps) => {
  const onUserDateChange = useCallback(
    (newDate: PickerDate) => {
      onDateChange?.(newDate, user);
    },
    [onDateChange, user]
  );
  return (
    <RemovableUser
      user={user}
      indicator={
        <BirthdayPicker
          acceptYear={false}
          onDateChange={onUserDateChange}
          defaultDate={defaultDate}
          sizeY={SizeType.COMPACT}
          popupDirection="bottom"
        />
      }
      {...props}
    />
  );
};

export default UserEditBirthday;
