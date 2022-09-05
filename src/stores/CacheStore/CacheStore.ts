import { Disposable } from "@utils/types";
import { action, makeObservable, observable } from "mobx";

export default class CacheStore implements Disposable {
  private readonly _cache = new Map<symbol, any>();

  constructor() {
    makeObservable<CacheStore, "_cache">(this, {
      _cache: observable,
      delete: action.bound,
      cache: action.bound,
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
