import { Disposable } from "@utils/types";

export default interface IScope {
  id: symbol;
  cache(id: symbol, data: Disposable): void;
  cached<V extends Disposable>(id: symbol): V | undefined;
  delete(id: symbol): void;
}
