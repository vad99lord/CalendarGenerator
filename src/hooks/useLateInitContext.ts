import { Context, createContext, useContext } from "react";

export const createLateInitContext = <T>() =>
  createContext<T | undefined>(undefined);

export const useLateInitContext = <T>(
  context: Context<T | undefined>
) => {
  const ctx = useContext(context);
  if (!ctx)
    throw new Error("Can't access not initialized lateinit context!");
  return ctx;
};
