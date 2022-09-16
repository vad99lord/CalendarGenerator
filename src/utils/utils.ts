export const toStringOrEmpty = (
  el: any | null | undefined
): string => {
  if (el === null || el === undefined) return "";
  return `${el}`;
};

export const isEmptyArray = (arr: any[]) => arr.length === 0;

export const isObject = (it: unknown): it is object => {
  const type = typeof it;
  return type === "function" || (type === "object" && it !== null);
};

export const peek = <Item>(arr: Item[]): Item | undefined =>
  arr[arr.length - 1];

export const deepCloneJson = <T>(obj: T) =>
  JSON.parse(JSON.stringify(obj)) as T;

export const filterValues = <V>(
  map: ReadonlyMap<any, V>,
  predicate: (value: V) => unknown
): V[] => {
  const filteredItems: V[] = [];
  map.forEach((val) => {
    if (predicate(val)) {
      filteredItems.push(val);
    }
  });
  return filteredItems;
};

export const mapValues = <V, U>(
  map: ReadonlyMap<any, V>,
  callbackfn: (value: V) => U
): U[] => {
  const mappedItems: U[] = [];
  map.forEach((val) => {
    mappedItems.push(callbackfn(val));
  });
  return mappedItems;
};

export const noOp = () => {};
