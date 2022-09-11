import { Disposable } from "@utils/types";

type ScopeData = Map<symbol, Disposable>;

export default class Scope implements Disposable {
  private readonly _data: ScopeData;
  private readonly _id: symbol;

  constructor(id: symbol) {
    this._data = new Map();
    this._id = id;
  }

  get id() {
    return this._id;
  }

  cache(id: symbol, data: Disposable) {
    this._data.set(id, data);
  }

  cached<V extends Disposable>(id: symbol) {
    const data = this._data.get(id);
    // casting assumption:
    // unique symbol hit corresponds to provided type
    return data ? (data as V) : undefined;
  }

  delete(id: symbol) {
    this._data.delete(id);
  }

  destroy() {
    this._data.forEach((disposable) => {
      disposable.destroy();
    });
    this._data.clear();
  }
}
