export const toStringOrEmpty = (
  el: any | null | undefined
): string => {
  if (el === null || el === undefined) return "";
  return `${el}`;
};

export const isEmptyArray = (arr: any[]) => arr.length === 0;

export const peek = <Item>(arr: Item[]): Item | undefined =>
  arr[arr.length - 1];
