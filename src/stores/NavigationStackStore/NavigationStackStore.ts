import { Disposable } from "@utils/types";
import { peek } from "@utils/utils";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  override,
  reaction,
} from "mobx";
import {
  INavigationStackStore,
  INonEmptyNavigationStackStore,
  ItemUpdate,
  Updater,
} from "./INavigationStackStore";
import NavigationStackError from "./NavigationStackError";

type NavigationStackMode = "Empty" | "NonEmpty";

abstract class NavigationStackStore<Item> implements Disposable {
  private readonly _stackMode: NavigationStackMode;
  private readonly _navStack: Item[];

  private readonly _assertCurrentEntryReaction: IReactionDisposer;

  constructor(
    initialItem?: Item,
    mode: NavigationStackMode = "Empty"
  ) {
    makeObservable<
      NavigationStackStore<any>,
      "_currentEntry" | "_navStack"
    >(this, {
      _navStack: observable,
      _currentEntry: computed,
      currentEntry: computed,
      next: action.bound,
      back: action.bound,
      replace: action.bound,
    });
    this._stackMode = mode;
    this._navStack = initialItem ? [initialItem] : [];
    this._assertCurrentEntryReaction = reaction(
      () => this.currentEntry,
      (currentEntry) => {
        NavigationStackStore.assertNullableCurrentEntry(
          this._stackMode,
          currentEntry
        );
      }
    );
  }

  private static assertNullableCurrentEntry = <Item>(
    mode: NavigationStackMode,
    entry?: Item
  ) => {
    if (mode === "NonEmpty" && !entry)
      throw new NavigationStackError(
        `currentEntry can't be undefined for ${mode} mode`
      );
  };

  private static peekNavStack = <Item>(
    stack: Item[],
    mode: NavigationStackMode
  ) => {
    switch (mode) {
      case "Empty":
        return peek(stack);
      case "NonEmpty": {
        const currentEntry = peek(stack);
        if (!currentEntry) {
          throw new NavigationStackError(
            `stack can't be empty during peek in ${mode}`
          );
        }
        return currentEntry;
      }
    }
  };

  protected get _currentEntry(): Item | undefined {
    return NavigationStackStore.peekNavStack(
      this._navStack,
      this._stackMode
    );
  }

  abstract get currentEntry(): Item | undefined;

  next(item: ItemUpdate<Item>) {
    if (typeof item === "function") {
      const currentEntry = NavigationStackStore.peekNavStack(
        this._navStack,
        this._stackMode
      );
      if (!currentEntry)
        throw new NavigationStackError(
          "no previous state to update in next!"
        );
      //can't discriminate updater without casting
      const newEntry = (item as Updater<Item>)(currentEntry);
      this._navStack.push(newEntry);
    } else {
      this._navStack.push(item);
    }
  }

  back() {
    const prevEntry = this._navStack.pop();
    if (!prevEntry)
      throw new NavigationStackError(
        "can't go back from empty stack!"
      );
    return prevEntry;
  }

  replace(item: ItemUpdate<Item>) {
    const prevEntry = NavigationStackStore.peekNavStack(
      this._navStack,
      this._stackMode
    );
    if (!prevEntry)
      throw new NavigationStackError(
        "can't replace current undefined entry!"
      );
    if (typeof item === "function") {
      //can't discriminate updater without casting
      const newEntry = (item as Updater<Item>)(prevEntry);
      this._navStack[this._navStack.length - 1] = newEntry;
    } else {
      this._navStack[this._navStack.length - 1] = item;
    }
  }

  destroy() {
    this._assertCurrentEntryReaction();
  }
}

export class EmptyNavStackStore<Item>
  extends NavigationStackStore<Item>
  implements INavigationStackStore<Item>
{
  get currentEntry(): Item | undefined {
    return this._currentEntry;
  }
  constructor(initialItem?: Item) {
    super(initialItem, "Empty");
    makeObservable(this, {
      currentEntry: override,
    });
  }
}

export class NonEmptyNavStackStore<Item>
  extends NavigationStackStore<Item>
  implements INonEmptyNavigationStackStore<Item>
{
  constructor(initialItem: Item) {
    super(initialItem, "NonEmpty");
    makeObservable(this, {
      currentEntry: override,
    });
  }

  override get currentEntry(): Item {
    return this._currentEntry!;
  }
}
