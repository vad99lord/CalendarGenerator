import UserPickerTab, { UserPickerTabProps } from "./UserPickerTab";

interface FriendsTabProps
  extends Pick<
    UserPickerTabProps<any>,
    "onNextClick" | "onOpenChecked" | "checkedUsersStore"
  > {}

const FriendsTab = ({ ...props }: FriendsTabProps) => {
  return (
    <UserPickerTab
      searchParamsName="SearchFriendsByQuery"
      {...props}
    />
  );
};

export default FriendsTab;
