import UserPickerTab, {
  UserPickerTabOuterProps,
} from "./UserPickerTab";

interface FriendsTabProps extends UserPickerTabOuterProps {}

const USER_STORE_PICKER_ID = Symbol("FriendsTab");

const FriendsTab = ({ ...props }: FriendsTabProps) => {
  return (
    <UserPickerTab
      componentId={USER_STORE_PICKER_ID}
      searchParamsName="SearchFriendsByQuery"
      {...props}
    />
  );
};

export default FriendsTab;
