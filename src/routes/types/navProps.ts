import { NavIdProps } from "@vkontakte/vkui";

export type NavElementId = Required<Pick<NavIdProps, "nav">>;

export type ScopeId = {
  scopeId: symbol | undefined;
};

export type StoreId = {
  storeId: symbol;
};

export type NavActionsProps = {
  onNextClick: () => void;
  onBackClick: () => void;
};
