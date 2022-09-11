import UsersPagination from "../../UsersPagination/UsersPagination";
import { UsersPickerTabOuterProps } from "../../UsersPickerTab/UsersPickerTab";

interface UsersTabProps extends UsersPickerTabOuterProps {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const UsersTab = ({ ...props }: UsersTabProps) => {
  console.log("UsersTab render");
  return (
    // <UsersPickerTab
    //   componentId={USER_STORE_PICKER_ID}
    //   enableSelectAll={false}
    //   searchParamsName="SearchUsersByQuery"
    //   {...props}
    // />
    <UsersPagination
      pagingParamsName="PaginateUsersByQuery"
      boundaryCount={0}
      storeId={USER_STORE_PICKER_ID}
      {...props}
    />
  );
};

export default UsersTab;
