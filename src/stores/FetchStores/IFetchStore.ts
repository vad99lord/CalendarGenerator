import {
  ApiErrorData,
  ApiResponse,
  ApiSuccessData,
} from "@network/types/ApiResponse";
import { Disposable } from "../../utils/types";
import { LoadState } from "../LoadState";

export default interface IFetchStore<
  in out Params extends object | void, //make Params invariant though used as in only
  Response extends ApiResponse
> extends Disposable {
  response?: Response;
  loadState: LoadState;
  data?: ApiSuccessData<Response>;
  error?: ApiErrorData<Response>;
  fetch(params: Params): void;
}
