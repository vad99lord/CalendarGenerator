import { fetchVkBridge } from "@network/vk/fetchVkBridge";
import {
  AnyRequestMethodName,
  ReceiveDataMap,
  RequestPropsMap,
} from "@vkontakte/vk-bridge";
import { VkStorage, VkStorageKeys } from "./IVkStorage";
import IVkStorageStore from "./IVkStorageStore";

export type VkApiStorage =
  ReceiveDataMap["VKWebAppStorageGet"]["keys"];
export type VkApiStorageKey = VkApiStorage[0]["key"];
export type VkApiStorageValue = VkApiStorage[0]["value"];
export type VkApiStorageKeys = VkApiStorageKey[];

type VkStorageMethods = Extract<
  AnyRequestMethodName,
  | "VKWebAppStorageGet"
  | "VKWebAppStorageSet"
  | "VKWebAppStorageGetKeys"
>;

type VKStorageMethodsParamsMap = Pick<
  RequestPropsMap,
  VkStorageMethods
>;

let VkStorageStore: IVkStorageStore;
VkStorageStore = class VkStorageStore {
  private static async _fetchStorage<Method extends VkStorageMethods>(
    method: Method,
    params: VKStorageMethodsParamsMap[Method]
  ) {
    const response = await fetchVkBridge(method, params);
    return response;
  }

  static async setStorage<Key extends VkStorageKeys>(
    key: Key,
    value: VkStorage[Key]
  ) {
    return VkStorageStore._fetchStorage("VKWebAppStorageSet", {
      key,
      value: JSON.stringify(value),
    });
  }

  //large count value effectively extracts all of the keys
  static async getStorageKeys(count = 100, offset = 0) {
    const response = await VkStorageStore._fetchStorage(
      "VKWebAppStorageGetKeys",
      {
        count,
        offset,
      }
    );
    const { isError, data } = response;
    if (isError) {
      return response;
    }
    return {
      isError,
      data: {
        keys: data.keys as VkStorageKeys[],
      },
    };
  }

  private static _apiStorageToStorage<Keys extends VkStorageKeys>(
    apiStorage: VkApiStorage
  ) {
    return apiStorage.reduce(
      (storage, { key: apiKey, value: apiVal }) => {
        const storageKey = apiKey as Keys;
        const storageVal: VkStorage[Keys] | undefined =
          apiVal === "" ? undefined : JSON.parse(apiVal);
        return { ...storage, [storageKey]: storageVal };
      },
      {} as Partial<Pick<VkStorage, Keys>>
    );
  }

  static async getStorage<Keys extends VkStorageKeys>(
    keys: readonly Keys[]
  ) {
    const response = await this._fetchStorage("VKWebAppStorageGet", {
      keys: keys.concat() as string[],
    });
    const { isError, data } = response;
    if (isError) {
      return response;
    }
    return {
      isError,
      data: {
        keys: VkStorageStore._apiStorageToStorage<Keys>(data.keys),
      },
    };
  }
};

export default VkStorageStore;
