import { AnyRequestMethodName } from "@vkontakte/vk-bridge";
import {
  MethodsNames,
  MethodsParamsMap,
} from "../network/vk/types/VkApi";
import { QueryParams } from "../network/vk/types/VkBridgeFetch";
import { VkApiFetchDeps } from "./VkApiFetchDepsProvider";

export interface VkApiParamsProvider<
  QueryParams extends object,
  Method extends MethodsNames
> {
  getVkApiParams(
    params: QueryParams &
      Pick<Required<VkApiFetchDeps>, "launchParams">
  ): MethodsParamsMap<Method>;
  method: Method;
}

export interface VkBridgeParamsProvider<
  Method extends AnyRequestMethodName,
  OuterParams extends object | void = void,
  Deps extends object | void = void
> {
  getVkBridgeParams(
    params: OuterParams & Required<Deps>
  ): QueryParams<Method>;
}
