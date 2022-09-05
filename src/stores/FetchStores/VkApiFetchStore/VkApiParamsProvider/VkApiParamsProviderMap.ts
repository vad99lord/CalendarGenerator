import { MethodsNames } from "../../../../network/vk/types/VkApi";
import { VkApiParamsProvider } from "./VkApiParamsProvider";

const VK_API_METHOD_PARAMS_NAMES = [
  "SearchFriendsByQuery",
  "SearchUsersByQuery",
] as const;
export type VkApiMethodParamsNames =
  typeof VK_API_METHOD_PARAMS_NAMES[number];

type VkApiMethodQueryParams<
  N extends VkApiMethodParamsNames,
  P extends object
> = Record<N, P>;

export type SearchParams = { query: string };

export type VkApiQueryParams = VkApiMethodQueryParams<
  "SearchFriendsByQuery",
  SearchParams
> &
  VkApiMethodQueryParams<"SearchUsersByQuery", SearchParams>;

type VkApiMethodParamsMethod<
  N extends VkApiMethodParamsNames,
  M extends MethodsNames
> = Record<N, M>;

export type VkApiParamsMethod = VkApiMethodParamsMethod<
  "SearchFriendsByQuery",
  "friends.search"
> &
  VkApiMethodParamsMethod<"SearchUsersByQuery", "users.search">;

export type VkApiParamsProviderMap = {
  [Name in VkApiMethodParamsNames]: VkApiParamsProvider<
    VkApiQueryParams[Name],
    VkApiParamsMethod[Name]
  >;
};

export const VK_API_PARAMS_PROVIDER_MAP: VkApiParamsProviderMap = {
  SearchFriendsByQuery: {
    method: "friends.search",
    getVkApiParams: ({ launchParams, query }) => {
      return {
        user_id: launchParams.vk_user_id,
        q: query,
        count: 20,
        offset: 0,
        //TODO extract to typed const somehow
        fields: "bdate,photo_100,photo_200,photo_max",
      };
    },
  },
  SearchUsersByQuery: {
    method: "users.search",
    getVkApiParams: ({ query }) => {
      return {
        q: query,
        count: 20,
        offset: 0,
        //TODO extract to typed const somehow
        fields: "bdate,photo_100,photo_200,photo_max",
      };
    },
  },
};
