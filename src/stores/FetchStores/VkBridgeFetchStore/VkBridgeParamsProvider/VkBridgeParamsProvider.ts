import { AnyRequestMethodName } from "@vkontakte/vk-bridge";
import { QueryParams } from "../../../../network/vk/types/VkBridgeFetch";

export default interface VkBridgeParamsProvider<
  Method extends AnyRequestMethodName,
  OuterParams extends object | void = void,
  Deps extends object | void = void
> {
  getVkBridgeParams(
    params: OuterParams & Required<Deps>
  ): QueryParams<Method>;
}
