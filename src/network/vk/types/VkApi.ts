import {
  FriendsSearchParams,
  FriendsSearchResponse,
  UsersReportParams,
  UsersReportResponse,
  UsersSearchParams,
  UsersSearchResponse,
} from "@vkontakte/api-schema-typescript";
import { DeepIndexSignature } from "../../../utils/types";
import { ApiMethod } from "../../types/ApiMethod";
import { ApiResponse } from "../../types/ApiResponse";
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
