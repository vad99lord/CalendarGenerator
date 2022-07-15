import { useState, useCallback, useRef } from "react";
import { UserID } from "../network/models/User/BaseUserModel";
import { UserModel } from "../network/models/User/UserModel";

export type CheckedUsers = Record<UserID, UserModel>;

const useCheckedUsersState = () => {
  const { current: checkedUsersMap } = useRef(
    new Map<UserID, UserModel>()
  );
  const [checkedUsers, setCheckedUsers] = useState<CheckedUsers>({});

  const checkedUsersCount = checkedUsersMap.size;

  const setUsersCheckChanged = useCallback(
    (isSelected: boolean, users: UserModel[]) => {
      if (isSelected) {
        users.forEach((user) => {
          checkedUsersMap.set(user.id, user);
        });
      } else {
        users.forEach((user) => {
          checkedUsersMap.delete(user.id);
        });
      }
      setCheckedUsers(Object.fromEntries(checkedUsersMap));
    },
    [checkedUsersMap]
  );

  const onUserCheckChanged = useCallback(
    (user: UserModel) => {
      if (checkedUsersMap.has(user.id)) {
        checkedUsersMap.delete(user.id);
      } else {
        checkedUsersMap.set(user.id, user);
      }
      setCheckedUsers(Object.fromEntries(checkedUsersMap));
    },
    [checkedUsersMap]
  );
  return [
    checkedUsers,
    checkedUsersCount,
    setUsersCheckChanged,
    onUserCheckChanged,
  ] as const;
};

export default useCheckedUsersState;
