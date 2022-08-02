import { Tabs, TabsProps } from "@vkontakte/vkui";
import TabsListItem, { TabItem, TabItemID } from "./TabsListItem";

export type TabsMap<ID extends TabItemID> = Record<ID, TabItem>;

type TabsListOwnProps<TabIDs extends TabItemID> = {
  selectedItem: TabIDs;
  tabs: TabsMap<TabIDs>;
  onItemClick: (tabID: TabIDs) => void;
};

export interface TabsListProps<TabIDs extends TabItemID>
  extends TabsProps,
    TabsListOwnProps<TabIDs> {}

const createTabsItems = <TabIDs extends TabItemID>({
  selectedItem,
  tabs,
  onItemClick,
}: TabsListOwnProps<TabIDs>) => {
  const tabsItems: JSX.Element[] = [];
  for (const tabID in tabs) {
    const tabItem = tabs[tabID];
    const isSelected = tabID === selectedItem;
    tabsItems.push(
      <TabsListItem
        // style={{ flex: 1 }}
        key={tabID}
        selected={isSelected}
        itemId={tabID}
        item={tabItem}
        onItemClick={onItemClick}
      >
        {tabItem.title}
      </TabsListItem>
    );
  }
  return tabsItems;
};

const TabsList = <TabIDs extends TabItemID>({
  selectedItem,
  tabs,
  onItemClick,
  ...tabsProps
}: TabsListProps<TabIDs>) => {
  const tabsItems = createTabsItems({
    selectedItem,
    tabs,
    onItemClick,
  });
  return <Tabs {...tabsProps}>{tabsItems}</Tabs>;
};

export default TabsList;
