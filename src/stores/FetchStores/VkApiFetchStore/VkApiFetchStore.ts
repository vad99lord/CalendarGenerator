import { fetchVkApi } from "@network/vk/fetchVkApi";
import { VkApiFetchResponse } from "@network/vk/types/VkApi";
import FetchBaseStore from "../FetchBaseStore/FetchBaseStore";
import IFetchStore from "../IFetchStore";
import {
  VkApiFetchDeps,
  VkApiFetchDepsProvider,
} from "./VkApiFetchDepsProvider/VkApiFetchDepsProvider";
import {
  VkApiMethodParamsNames,
  VkApiParamsMethod,
  VkApiParamsProviderMap,
  VkApiQueryParams,
} from "./VkApiParamsProvider/VkApiParamsProviderMap";

export type IVkApiFetchStore<P extends VkApiMethodParamsNames> =
  IFetchStore<
    VkApiQueryParams[P],
    VkApiFetchResponse<VkApiParamsMethod[P]>
  >;
export default class VkApiFetchStore<
    ParamsName extends VkApiMethodParamsNames
  >
  extends FetchBaseStore<
    VkApiQueryParams[ParamsName],
    VkApiFetchDeps,
    VkApiFetchResponse<VkApiParamsMethod[ParamsName]>
  >
  implements IVkApiFetchStore<ParamsName>
{
  private readonly _paramsProvider: VkApiParamsProviderMap[ParamsName];

  constructor(
    depsProvider: VkApiFetchDepsProvider,
    paramsProvider: VkApiParamsProviderMap[ParamsName]
  ) {
    super(depsProvider);
    this._paramsProvider = paramsProvider;
  }

  protected async _fetchApi(
    params: VkApiQueryParams[ParamsName] & Required<VkApiFetchDeps>
  ) {
    const apiParams = this._paramsProvider.getVkApiParams(params);
    const resp = await fetchVkApi(
      this._paramsProvider.method,
      apiParams,
      params.token
    );
    return resp;
  }
}
