import UserPickerTab, { UserPickerTabProps } from "./UserPickerTab";

interface UsersTabProps
  extends Pick<
    UserPickerTabProps<any>,
    "onNextClick" | "onOpenChecked" | "checkedUsersStore"
  > {}

const UsersTab = ({ ...props }: UsersTabProps) => {
  return (
    <UserPickerTab
      enableSelectAll={false}
      searchParamsName="SearchUsersByQuery"
      {...props}
    />
  );
};

export default UsersTab;
