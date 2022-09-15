import { IVkBridgeFetchStore } from "@stores/FetchStores/VkBridgeFetchStore/VkBridgeFetchStore";
import { GetLaunchParamsResponse } from "@vkontakte/vk-bridge";

export type LaunchParams = GetLaunchParamsResponse;

export type IConfigStore =
  IVkBridgeFetchStore<"VKWebAppGetLaunchParams">;
