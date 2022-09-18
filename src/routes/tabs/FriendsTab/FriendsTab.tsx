import { ScopeId } from "@routes/types/navProps";
import { memo } from "react";
import UsersPickerTab, {
  UsersPickerTabOuterProps,
} from "../UsersPickerTab/UsersPickerTab";

interface FriendsTabProps extends UsersPickerTabOuterProps, ScopeId {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const FriendsTab = ({ ...props }: FriendsTabProps) => {
  console.log("FriendsTab render");
  return (
    <UsersPickerTab
      pagingParamsName="PaginateFriendsByQuery"
      storeId={USER_STORE_PICKER_ID}
      {...props}
    />
  );
};

export default memo(FriendsTab);
