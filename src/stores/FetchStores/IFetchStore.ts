import {
  ApiErrorData,
  ApiResponse,
  ApiSuccessData,
} from "@network/types/ApiResponse";
import { Disposable } from "../../utils/types";
import { LoadState } from "../LoadState";

export default interface IFetchStore<
Params extends object | void,
Response extends ApiResponse
> extends Disposable{
  response?: Response;
  loadState: LoadState;
  data?: ApiSuccessData<Response>;
  error?: ApiErrorData<Response>;
  fetch(params: Params): void;
}
