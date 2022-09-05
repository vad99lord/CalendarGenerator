import { Disposable } from "@utils/types";

export type Updater<Item> = (prevState: Item) => Item;

export type ItemUpdate<Item> = Item | Updater<Item>;

export interface NavigationActions<Item> {
  next: (item: ItemUpdate<Item>) => void;
  back: () => Item;
  replace: (item: ItemUpdate<Item>) => void;
}

export interface INavigationStackStore<Item>
  extends NavigationActions<Item>,
    Disposable {
  currentEntry: Item | undefined;
}

export interface INonEmptyNavigationStackStore<Item>
  extends INavigationStackStore<Item> {
  currentEntry: Item;
}
