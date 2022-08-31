import UserPickerTab, {
  UserPickerTabOuterProps,
} from "./UserPickerTab";

interface UsersTabProps extends UserPickerTabOuterProps {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const UsersTab = ({ ...props }: UsersTabProps) => {
  return (
    <UserPickerTab
      componentId={USER_STORE_PICKER_ID}
      enableSelectAll={false}
      searchParamsName="SearchUsersByQuery"
      {...props}
    />
  );
};

export default UsersTab;
