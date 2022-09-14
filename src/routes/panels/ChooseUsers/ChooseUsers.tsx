import TabsList, { TabsMap } from "@components/TabsList/TabsList";
import { NavElementId } from "@routes/types/navProps";
import { Panel, PanelHeader } from "@vkontakte/vkui";
import { useCallback } from "react";
import FriendsTab from "../../tabs/FriendsTab/FriendsTab";
import { UsersPickerTabOuterProps } from "../../tabs/UsersPickerTab/UsersPickerTab";
import UsersTab from "../../tabs/UsersTab/UsersTab";

export interface ChooseUsersProps
  extends UsersPickerTabOuterProps,
    NavElementId {
  onTabChange: (activeTab: ChooseUsersTabs) => void;
  selectedTab: ChooseUsersTabs;
}

const CHOOSE_USERS_TABS = ["FRIENDS", "USERS"] as const;
export type ChooseUsersTabs = typeof CHOOSE_USERS_TABS[number];

export const CHOOSE_USERS_TABS_ITEMS: TabsMap<ChooseUsersTabs> = {
  FRIENDS: {
    title: "Друзья",
  },
  USERS: {
    title: "Пользователи",
  },
};

const getTabContent = (
  tab: ChooseUsersTabs,
  props: UsersPickerTabOuterProps
) => {
  switch (tab) {
    case "FRIENDS":
      return <FriendsTab {...props} />;
    case "USERS":
      return <UsersTab {...props} />;
  }
};

const ChooseUsers = ({
  nav: panelId,
  onTabChange,
  selectedTab,
  ...props
}: ChooseUsersProps) => {
  const onTabClick = useCallback(
    (tabID: ChooseUsersTabs) => {
      onTabChange(tabID);
    },
    [onTabChange]
  );
  console.log("ChooseUsers RENDER");
  console.log({ panelId, selectedTab });
  const tabContent = getTabContent(selectedTab, props);

  return (
    <Panel id={panelId}>
      <PanelHeader separator={false}>Выбор пользователей</PanelHeader>
      <TabsList
        selectedItem={selectedTab}
        tabs={CHOOSE_USERS_TABS_ITEMS}
        onItemClick={onTabClick}
        mode={"segmented"}
      />
      {tabContent}
    </Panel>
  );
};

//TODO add memo
export default ChooseUsers;
