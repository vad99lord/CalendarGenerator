import { QueryResponse } from "@network/vk/types/VkBridgeFetch";
import StoreData from "./StoreData";

export type AuthStore = StoreData<
  QueryResponse<"VKWebAppGetAuthToken">
>;
