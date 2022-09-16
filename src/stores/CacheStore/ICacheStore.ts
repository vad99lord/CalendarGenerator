import { Disposable } from "@utils/types";

//TODO add proper interface
export default interface ICacheStore extends Disposable {
  cache<V>(id: symbol, data: V): void;
  delete(id: symbol): void;
  /**
   * Non-observable cache getter for current cache state
   * @param id symbol cache id
   * @returns undefined or casted data
   */
  cached<V>(id: symbol): V | undefined;
}
