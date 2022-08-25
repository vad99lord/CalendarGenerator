import { computed, makeObservable, toJS } from "mobx";
import { fetchVkApi } from "../network/vk/fetchVkApi";
import {
  MethodsNames,
  VkApiFetchResponse,
} from "../network/vk/types/VkApi";
import FetchBaseStore from "./FetchBaseStore";
import {
  VkApiFetchDeps,
  VkApiFetchDepsProvider,
} from "./VkApiFetchDepsProvider";
import { VkApiParamsProvider } from "./VkApiParamsProvider";

export default class VkApiFetchStore<
  QueryParams extends object,
  Method extends MethodsNames
> extends FetchBaseStore<
  QueryParams,
  VkApiFetchDeps,
  VkApiFetchResponse<Method>
> {
  private readonly _depsProvider: VkApiFetchDepsProvider;
  private readonly _paramsProvider: VkApiParamsProvider<
    QueryParams,
    Method
  >;

  constructor(
    depsProvider: VkApiFetchDepsProvider,
    paramsProvider: VkApiParamsProvider<QueryParams, Method>
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
    params: QueryParams & Required<VkApiFetchDeps>
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
