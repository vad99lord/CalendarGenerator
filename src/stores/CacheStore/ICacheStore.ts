import { Disposable } from "@utils/types";
import IScope from "./Scope/IScope";

export default interface ICacheStore {
  createScope(scopeId: symbol): IScope;
  destroyScope(scopeId: symbol): void;
  cache(scopeId: symbol, dataId: symbol, data: Disposable): void;
  delete(scopeId: symbol, dataId: symbol): void;
  cached<V extends Disposable>(
    scopeId: symbol,
    dataId: symbol
  ): V | undefined;
}
