import UsersPagination from "../../UsersPagination/UsersPagination";
import { UsersPickerTabOuterProps } from "../../UsersPickerTab/UsersPickerTab";

interface FriendsTabProps extends UsersPickerTabOuterProps {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const FriendsTab = ({ ...props }: FriendsTabProps) => {
  return (
    // <UsersPickerTab
    //   componentId={USER_STORE_PICKER_ID}
    //   searchParamsName="SearchFriendsByQuery"
    //   {...props}
    // />
    <UsersPagination {...props}/>
  );
};

export default FriendsTab;
