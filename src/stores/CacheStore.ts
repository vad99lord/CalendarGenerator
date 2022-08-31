import { action, makeObservable, observable } from "mobx";
import { Disposable } from "../utils/types";

export default class CacheStore implements Disposable {
  private _cache = new Map<symbol, any>();
  state: Pick<ReadonlyMap<symbol, any>, "has" | "get"> = this._cache;

  constructor() {
    makeObservable<CacheStore, "_cache">(this, {
      _cache: observable,
      delete: action.bound,
      cache: action.bound,
      state: observable,
    });
  }

  destroy() {
    this._cache.clear();
  }

  cache<V>(id: symbol, data: V) {
    this._cache.set(id, data);
  }

  delete(id: symbol) {
    this._cache.delete(id);
  }

  /**
   * Non-observable cache getter for current cache state
   * @param id symbol cache id
   * @returns undefined or casted data
   */
  cached<V>(id: symbol) {
    const data = this._cache.get(id);
    // casting assumption:
    // unique symbol hit corresponds to provided type
    return data ? (data as V) : undefined;
  }
}
