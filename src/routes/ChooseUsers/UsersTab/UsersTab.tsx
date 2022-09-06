import UsersPickerTab, {
  UsersPickerTabOuterProps,
} from "../../UsersPickerTab/UsersPickerTab";

interface UsersTabProps extends UsersPickerTabOuterProps {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const UsersTab = ({ ...props }: UsersTabProps) => {
  return (
    // <UsersPickerTab
    //   componentId={USER_STORE_PICKER_ID}
    //   enableSelectAll={false}
    //   searchParamsName="SearchUsersByQuery"
    //   {...props}
    // />
    <div>TODO</div>
  );
};

export default UsersTab;
