import {
  ApiErrorData,
  ApiResponse,
  ApiSuccessData,
} from "@network/types/ApiResponse";
import { LoadState } from "./LoadState";

export default interface IFetchStore<
  in out Params extends object | void, //make Params invariant though used as in only
  Response extends ApiResponse
> {
  response: Response | undefined;
  loadState: LoadState;
  data: ApiSuccessData<Response> | undefined;
  error: ApiErrorData<Response> | undefined;
  fetch(params: Params): void;
}

export type IFetchStoreParams<Store extends IFetchStore<any, any>> =
  Store extends IFetchStore<infer Params, any> ? Params : never;
