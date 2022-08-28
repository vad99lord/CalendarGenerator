import { Div, NavIdProps, Panel, PanelHeader } from "@vkontakte/vkui";
import { useCallback } from "react";
import TabsList, { TabsMap } from "../components/TabsList/TabsList";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import Friends, { FriendsProps } from "./Friends";
import UsersTab from "./UsersTab";

export type NavElementId = Required<Pick<NavIdProps, "nav">>;

export interface ChooseUsersProps extends FriendsProps, NavElementId {
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

const getTabContent = (tab: ChooseUsersTabs, props: FriendsProps) => {
  switch (tab) {
    case "FRIENDS":
      return <Friends {...props} />;
    case "USERS":
      return <Div>todo</Div>
      // return <UsersTab {...props} />;
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

export default ChooseUsers;
