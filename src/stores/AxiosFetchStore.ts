import {
  ApiEndpoints,
  ApiMethodsData,
} from "../network/api/ApiConfig";
import fetchAxios, {
  AxiosFetchError,
  FetchAxiosParams,
} from "../network/api/fetchAxios";
import { ApiResponse } from "../network/types/ApiResponse";
import FetchBaseStore from "./FetchBaseStore";

export type AxiosFetchStoreParams<E extends ApiEndpoints> =
  FetchAxiosParams<E>;

export default class AxiosFetchStore<
  E extends ApiEndpoints
> extends FetchBaseStore<
  AxiosFetchStoreParams<E>,
  {},
  ApiResponse<ApiMethodsData[E]["response"], AxiosFetchError>
> {
  protected _getFetchDeps(): {} {
    return {};
  }
  protected async _fetchApi(
    params: AxiosFetchStoreParams<E>
  ): Promise<ApiResponse<ApiMethodsData[E]["response"], string>> {
    const response = await fetchAxios<E>(params);
    return response;
  }
}
