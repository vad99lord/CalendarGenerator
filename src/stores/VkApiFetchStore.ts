import { computed, makeObservable } from "mobx";
import { fetchVkApi } from "../network/vk/fetchVkApi";
import { VkApiFetchResponse } from "../network/vk/types/VkApi";
import FetchBaseStore from "./FetchBaseStore";
import {
  VkApiFetchDeps,
  VkApiFetchDepsProvider,
} from "./VkApiFetchDepsProvider";
import {
  VkApiMethodParamsNames,
  VkApiParamsMethod,
  VkApiParamsProviderMap,
  VkApiQueryParams,
} from "./VkApiParamsProviderMap";

export default class VkApiFetchStore<
  ParamsName extends VkApiMethodParamsNames
> extends FetchBaseStore<
  VkApiQueryParams[ParamsName],
  VkApiFetchDeps,
  VkApiFetchResponse<VkApiParamsMethod[ParamsName]>
> {
  private readonly _depsProvider: VkApiFetchDepsProvider;
  private readonly _paramsProvider: VkApiParamsProviderMap[ParamsName];

  constructor(
    depsProvider: VkApiFetchDepsProvider,
    paramsProvider: VkApiParamsProviderMap[ParamsName]
  ) {
    super();
    this._depsProvider = depsProvider;
    this._paramsProvider = paramsProvider;
    makeObservable(this, {
      data: computed,
    });
  }

  get data() {
    if (!this.response || this.response.isError) return undefined;
    return this.response.data;
  }

  protected _getFetchDeps() {
    return this._depsProvider.getVkApiFetchDeps();
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
