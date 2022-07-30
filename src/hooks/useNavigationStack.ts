import { useCallback, useRef, useState } from "react";
import { peek } from "../utils/utils";

export type NavigationStack<Item> = {
  currentEntry?: Item;
  next: (item: Item) => void;
  back: () => Item;
};

const useNavigationStack = <Item>(): NavigationStack<Item> => {
  const { current: navStack } = useRef<Item[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Item>();
  const next = useCallback(
    (item: Item) => {
      navStack.push(item);
      setCurrentEntry(peek(navStack));
    },
    [navStack]
  );
  const back = useCallback((): Item => {
    const prevEntry = navStack.pop();
    if (!prevEntry)
      throw new Error(
        "Navigation stack: can't go back from empty stack!"
      );
    setCurrentEntry(peek(navStack));
    return prevEntry;
  }, [navStack]);
  return {
    currentEntry,
    back,
    next,
  };
};

export default useNavigationStack;
