import { fetchVkBridge } from "@network/vk/fetchVkBridge";
import { VkBridgeFetchResponse } from "@network/vk/types/VkBridgeFetch";
import { AnyRequestMethodName } from "@vkontakte/vk-bridge";
import FetchBaseStore from "../FetchBaseStore/FetchBaseStore";
import FetchDepsProvider from "../FetchDepsProvider/FetchDepsProvider";
import VkBridgeParamsProvider from "./VkBridgeParamsProvider/VkBridgeParamsProvider";

export default class VkBridgeFetchStore<
  Method extends AnyRequestMethodName,
  OuterParams extends object | void = void,
  Deps extends object | void = void
> extends FetchBaseStore<
  OuterParams,
  Deps,
  VkBridgeFetchResponse<Method>
> {
  private readonly _paramsProvider: VkBridgeParamsProvider<
    Method,
    OuterParams,
    Deps
  >;

  constructor(
    depsProvider: FetchDepsProvider<Deps>,
    paramsProvider: VkBridgeParamsProvider<Method, OuterParams, Deps>
  ) {
    super(depsProvider);
    this._paramsProvider = paramsProvider;
  }

  protected async _fetchApi(
    params: OuterParams & Required<Deps>
  ): Promise<VkBridgeFetchResponse<Method>> {
    const vkParams = this._paramsProvider.getVkBridgeParams(params);
    const resp = await fetchVkBridge(...vkParams);
    return resp;
  }
}
