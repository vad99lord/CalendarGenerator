import { DeepIndexSignature } from "@utils/types";
import {
  FriendsSearchParams,
  FriendsSearchResponse,
  UsersSearchParams,
  UsersSearchResponse,
} from "@vkontakte/api-schema-typescript";
import { ApiMethod } from "../../types/ApiMethod";
import {
  ApiError,
  ApiResponse,
  ApiSuccess,
} from "../../types/ApiResponse";
import { VKBridgeError } from "./VkBridgeFetch";

type VkApiMethod<
  N extends string,
  P extends object,
  R extends any
> = ApiMethod<N, DeepIndexSignature<P>, R>;

type Methods = VkApiMethod<
  "users.search",
  UsersSearchParams,
  UsersSearchResponse
> &
  VkApiMethod<
    "friends.search",
    FriendsSearchParams,
    FriendsSearchResponse
  >;

export type MethodsParamsMap<K extends MethodsNames> =
  Methods[K]["params"];

export type MethodsResponsesMap<K extends MethodsNames> =
  Methods[K]["response"];

export type MethodsNames = keyof Methods;

export type VkApiFetchResponse<T extends MethodsNames> = ApiResponse<
  MethodsResponsesMap<T>,
  VKBridgeError
>;

export type VkSuccessResponse<M extends MethodsNames> = Extract<
  VkApiFetchResponse<M>,
  ApiSuccess
>["data"];

export type VkErrorResponse = Extract<
  VkApiFetchResponse<any>,
  ApiError
>["data"];
