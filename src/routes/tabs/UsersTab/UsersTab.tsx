import { ScopeId } from "@routes/types/navProps";
import UsersPickerTab, {
  UsersPickerTabOuterProps,
} from "../UsersPickerTab/UsersPickerTab";

interface UsersTabProps extends UsersPickerTabOuterProps, ScopeId {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const UsersTab = ({ ...props }: UsersTabProps) => {
  console.log("UsersTab render");
  return (
    <UsersPickerTab
      pagingParamsName="PaginateUsersByQuery"
      boundaryCount={0}
      storeId={USER_STORE_PICKER_ID}
      enableSelectAll={false}
      {...props}
    />
  );
};

export default UsersTab;
