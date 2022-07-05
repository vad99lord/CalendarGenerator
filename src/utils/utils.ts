import { createContext } from "react";

export const toStringOrEmpty = (
  el: any | null | undefined
): string => {
  if (el === null || el === undefined) return "";
  return `${el}`;
};

export const createLateInitContext = <T>() =>
  createContext<T | undefined>(undefined);
