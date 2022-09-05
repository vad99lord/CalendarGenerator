import { FlatAwaited } from "@utils/types";
import {
  AnyRequestMethodName,
  ErrorData,
  VKBridgeSend,
} from "@vkontakte/vk-bridge";
import { ApiResponse } from "../../types/ApiResponse";

//extra variable makes it possible to extract generic parameters from send function
let send: VKBridgeSend;
export type QueryParams<T extends AnyRequestMethodName> = Parameters<
  typeof send<T>
>;

export type QueryResponse<T extends AnyRequestMethodName> =
  FlatAwaited<ReturnType<typeof send<T>>>;

export type VkBridgeFetchResponse<T extends AnyRequestMethodName> =
  ApiResponse<QueryResponse<T>, VKBridgeError>;

export type VKBridgeError = ErrorData | string | null;
