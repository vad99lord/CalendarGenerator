import { Disposable } from "@utils/types";
import Scope from "./Scope";

type CacheData = Map<symbol, Scope>;

export default class CacheStore {
  private static readonly TAG = "CacheStore";
  private readonly _cache: CacheData = new Map();

  private _getScope(scopeId: symbol) {
    const scope = this._cache.get(scopeId);
    if (!scope) {
      CacheStore._warnMessage("no scope found");
    }
    return scope;
  }

  private static _warnMessage(message: string) {
    console.warn(`${CacheStore.TAG}: ${message}`);
  }

  createScope(scopeId: symbol) {
    const scope = new Scope(scopeId);
    this._cache.set(scopeId, scope);
    return scope;
  }

  destroyScope(scopeId: symbol) {
    this._cache.get(scopeId)?.destroy();
    this._cache.delete(scopeId);
  }

  cache(scopeId: symbol, dataId: symbol, data: Disposable) {
    const scope = this._getScope(scopeId);
    scope?.cache(dataId, data);
  }

  cached<V extends Disposable>(scopeId: symbol, dataId: symbol) {
    const scope = this._getScope(scopeId);
    return scope?.cached<V>(dataId);
  }

  delete(scopeId: symbol, dataId: symbol) {
    const scope = this._getScope(scopeId);
    scope?.delete(dataId);
  }

  destroy() {
    this._cache.forEach((scope) => {
      scope.destroy();
    });
    this._cache.clear();
  }
}
