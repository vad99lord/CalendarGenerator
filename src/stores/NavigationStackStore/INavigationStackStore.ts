import { Disposable } from "@utils/types";

export type Updater<Item> = (prevState: Item) => Item;

export type ItemUpdate<Item> = Item | Updater<Item>;

export type Matcher<Item> = (state: Item) => boolean;

export interface NavigationActions<Item> {
  next: (item: ItemUpdate<Item>) => void;
  back: () => Item;
  replace: (item: ItemUpdate<Item>) => void;
  //get to matched entry, potentially multiple steps backward
  backUpTo: (matcher: Matcher<Item>) => void;
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
