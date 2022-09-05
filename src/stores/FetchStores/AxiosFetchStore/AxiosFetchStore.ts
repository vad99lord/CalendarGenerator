import {
  ApiEndpoints,
  ApiMethodsData,
  AxiosApiResponse,
} from "@network/api/ApiConfig";
import fetchAxios, {
  FetchAxiosParams,
} from "@network/api/fetchAxios";
import { ApiResponse } from "@network/types/ApiResponse";
import FetchBaseStore from "../FetchBaseStore/FetchBaseStore";
import emptyDepsProvider from "../FetchDepsProvider/EmptyFetchDepsProvider";
import IFetchStore from "../IFetchStore";

export type AxiosFetchStoreParams<E extends ApiEndpoints> =
  FetchAxiosParams<E>;

export type IAxiosFetchStore<E extends ApiEndpoints> = IFetchStore<
  AxiosFetchStoreParams<E>,
  AxiosApiResponse<E>
>;

export default class AxiosFetchStore<E extends ApiEndpoints>
  extends FetchBaseStore<
    AxiosFetchStoreParams<E>,
    void,
    AxiosApiResponse<E>
  >
  implements IAxiosFetchStore<E>
{
  constructor() {
    super(emptyDepsProvider);
  }

  protected async _fetchApi(
    params: AxiosFetchStoreParams<E>
  ): Promise<ApiResponse<ApiMethodsData[E]["response"], string>> {
    const response = await fetchAxios<E>(params);
    return response;
  }
}
