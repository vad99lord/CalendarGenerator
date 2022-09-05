import { UserID } from "@network/models/User/BaseUserModel";
import { UserModel } from "@network/models/User/UserModel";
import { useCallback, useRef, useState } from "react";

export type CheckedUsersMap = Record<UserID, UserModel>;

export type CheckedUsers = {
  state: CheckedUsersMap;
  count: number;
  setUsersCheckChanged: (
    isSelected: boolean,
    users: UserModel[]
  ) => void;
  onUserCheckChanged: (user: UserModel) => void;
  removeUserCheck: (userId: UserID) => void;
  clearCheckedUsers: () => void;
};

const useCheckedUsersState = (): CheckedUsers => {
  const { current: checkedUsersMap } = useRef(
    new Map<UserID, UserModel>()
  );
  const [checkedUsers, setCheckedUsers] = useState<CheckedUsersMap>(
    {}
  );

  const updateCheckedStateFromMap = useCallback(() => {
    setCheckedUsers(Object.fromEntries(checkedUsersMap));
  }, [checkedUsersMap]);

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
      updateCheckedStateFromMap();
    },
    [checkedUsersMap, updateCheckedStateFromMap]
  );

  const removeUserCheck = useCallback(
    (userId: UserID) => {
      if (checkedUsersMap.has(userId)) {
        checkedUsersMap.delete(userId);
        updateCheckedStateFromMap();
      }
    },
    [checkedUsersMap, updateCheckedStateFromMap]
  );

  const onUserCheckChanged = useCallback(
    (user: UserModel) => {
      if (checkedUsersMap.has(user.id)) {
        checkedUsersMap.delete(user.id);
      } else {
        checkedUsersMap.set(user.id, user);
      }
      updateCheckedStateFromMap();
    },
    [checkedUsersMap, updateCheckedStateFromMap]
  );

  const clearCheckedUsers = useCallback(() => {
    checkedUsersMap.clear();
    updateCheckedStateFromMap();
  }, [checkedUsersMap, updateCheckedStateFromMap]);
  return {
    state: checkedUsers,
    count: checkedUsersCount,
    setUsersCheckChanged,
    onUserCheckChanged,
    removeUserCheck,
    clearCheckedUsers,
  };
};

export default useCheckedUsersState;
