import { TabsItem, TabsItemProps } from "@vkontakte/vkui";
import { useCallback } from "react";

export type TabItemID = string | number;

export type TabItem = {
  readonly title: string;
};

export interface TabsListItemProps<TabID extends TabItemID>
  extends TabsItemProps {
  itemId: TabID;
  onItemClick: (tabID: TabID) => void;
  item: TabItem;
}

const TabsListItem = <TabID extends TabItemID>({
  itemId,
  item,
  onItemClick,
  ...props
}: TabsListItemProps<TabID>) => {
  const onClick = useCallback(() => {
    onItemClick(itemId);
  }, [itemId, onItemClick]);
  return (
    <TabsItem onClick={onClick} {...props}>
      {item.title}
    </TabsItem>
  );
};

export default TabsListItem;
