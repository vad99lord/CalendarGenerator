import { useCallback, useRef, useState } from "react";
import { peek } from "../utils/utils";

export interface NavigationActions<Item> {
  next: (item: Item) => void;
  back: () => Item;
  replace: (item: Item) => void;
}

type NonEmptyNavigationStack<Item> = NavigationActions<Item> & {
  currentEntry: Item;
};
type EmptyNavigationStack<Item> = NavigationActions<Item> & {
  currentEntry?: Item;
};
type NavigationStackConfig<Item> =
  | {
      initialItem: Item;
      mode: "NonEmpty";
    }
  | {
      mode: "Empty";
    };
type NavigationStackMode = NavigationStackConfig<any>["mode"];

export type NavigationStack<Item> =
  | NonEmptyNavigationStack<Item>
  | EmptyNavigationStack<Item>;

const navigationStackError = (message: string) => {
  return new Error(`Navigation stack error: ${message}`);
};

const peekNavStack = <Item>(
  stack: Item[],
  mode: NavigationStackMode
) => {
  switch (mode) {
    case "Empty":
      return peek(stack);
    case "NonEmpty": {
      const currentEntry = peek(stack);
      if (!currentEntry) {
        throw navigationStackError(
          `stack can't be empty during peek in ${mode}`
        );
      }
      return currentEntry;
    }
  }
};

const assertNullableCurrentEntry = <Item>(
  mode: NavigationStackMode,
  entry?: Item
) => {
  if (mode === "NonEmpty" && !entry)
    throw navigationStackError(
      `currentEntry can't be undefined for ${mode}`
    );
};

function useNavigationStack<Item>(
  initialItem: Item
): NonEmptyNavigationStack<Item>;
function useNavigationStack<Item>(): EmptyNavigationStack<Item>;
function useNavigationStack<Item>(
  initialItem?: Item
): NavigationStack<Item> {
  const { current: config } = useRef<NavigationStackConfig<Item>>({
    ...(initialItem
      ? { initialItem, mode: "NonEmpty" }
      : { mode: "Empty" }),
  });
  const { current: navStack } = useRef<Item[]>(
    initialItem ? [initialItem] : []
  );
  const [currentEntry, setCurrentEntry] = useState<Item | undefined>(
    initialItem
  );

  const next = useCallback(
    (item: Item) => {
      navStack.push(item);
      setCurrentEntry(peekNavStack(navStack, config.mode));
    },
    [config, navStack]
  );

  const back = useCallback((): Item => {
    const prevEntry = navStack.pop();
    if (!prevEntry)
      throw navigationStackError("can't go back from empty stack!");
    const currentEntry = peekNavStack(navStack, config.mode);
    setCurrentEntry(currentEntry);
    return prevEntry;
  }, [config, navStack]);

  const replace = useCallback(
    (item: Item) => {
      const prevEntry = peekNavStack(navStack, config.mode);
      if (!prevEntry)
        throw navigationStackError("can't replace current undefined entry!");
      navStack[navStack.length - 1] = item;
      setCurrentEntry(peek(navStack)!!);
    },
    [config, navStack]
  );
  // console.log({ config, currentEntry, navStack });
  assertNullableCurrentEntry(config.mode, currentEntry);
  return {
    currentEntry,
    back,
    next,
    replace,
  };
}

export default useNavigationStack;
