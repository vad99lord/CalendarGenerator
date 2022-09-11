import UsersPagination from "../../UsersPagination/UsersPagination";
import { UsersPickerTabOuterProps } from "../../UsersPickerTab/UsersPickerTab";
import { ScopeId } from "../ChooseUsers";

interface FriendsTabProps extends UsersPickerTabOuterProps, ScopeId {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const FriendsTab = ({ ...props }: FriendsTabProps) => {
  console.log("FriendsTab render");
  return (
    // <UsersPickerTab
    //   componentId={USER_STORE_PICKER_ID}
    //   searchParamsName="SearchFriendsByQuery"
    //   {...props}
    // />
    <UsersPagination
      pagingParamsName="PaginateFriendsByQuery"
      {...props}
      storeId={USER_STORE_PICKER_ID}
    />
  );
};

export default FriendsTab;
