import { QueryParams } from "@network/vk/types/VkBridgeFetch";
import { AnyRequestMethodName } from "@vkontakte/vk-bridge";

export default interface VkBridgeParamsProvider<
  Method extends AnyRequestMethodName,
  OuterParams extends object | void = void,
  Deps extends object | void = void
> {
  getVkBridgeParams(
    params: OuterParams & Required<Deps>
  ): QueryParams<Method>;
}
