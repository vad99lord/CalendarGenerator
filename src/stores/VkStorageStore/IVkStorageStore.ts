import { ApiResponse } from "@network/types/ApiResponse";
import {
  VKBridgeError,
  VkBridgeFetchResponse,
} from "@network/vk/types/VkBridgeFetch";
import { VkStorage, VkStorageKeys } from "./IVkStorage";

export type VkStorageGetResponse<Keys extends VkStorageKeys> = {
  keys: Partial<Pick<VkStorage, Keys>>;
};

export type VkStorageGetKeysResponse = {
  keys: VkStorageKeys[];
};

export default interface IVkStorageStore {
  setStorage<Key extends VkStorageKeys>(
    key: Key,
    value: VkStorage[Key]
  ): Promise<VkBridgeFetchResponse<"VKWebAppStorageSet">>;

  getStorageKeys(
    count?: number,
    offset?: number
  ): Promise<ApiResponse<VkStorageGetKeysResponse, VKBridgeError>>;

  getStorage<Keys extends VkStorageKeys>(
    keys: readonly Keys[]
  ): Promise<ApiResponse<VkStorageGetResponse<Keys>, VKBridgeError>>;
}
