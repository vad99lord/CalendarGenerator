import {
  ApiErrorData,
  ApiResponse,
  ApiSuccessData,
} from "@network/types/ApiResponse";
import { Disposable } from "@utils/types";
import { isObject } from "@utils/utils";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { LoadState, StartState } from "../LoadState";
import FetchDepsProvider from "../FetchDepsProvider/FetchDepsProvider";
import IFetchStore from "../IFetchStore";

type FetchParams<OwnParams, DepsParams> = OwnParams & DepsParams;
type InternalLoadState = LoadState | StartState;

type FetchDepsInternal<Deps> = {
  loadState: InternalLoadState;
  fetchDeps: Deps;
};

const log = console.log;
export default abstract class FetchBaseStore<
  OwnFetchParams extends object | void,
  DepsFetchParams extends object | void,
  Response extends ApiResponse
> implements IFetchStore<OwnFetchParams, Response>, Disposable
{
  private _response?: Response = undefined;
  private _loadState: InternalLoadState = LoadState.Initial;
  private _fetchReaction!: IReactionDisposer;
  private _params?: OwnFetchParams | null;
  readonly id = Math.random();
  private readonly _depsProvider: FetchDepsProvider<DepsFetchParams>;
  /**
   *
   * @param getFetchDeps provides object with observable dependencies for fetch
   */
  constructor(depsProvider: FetchDepsProvider<DepsFetchParams>) {
    makeObservable<
      FetchBaseStore<any, any, any>,
      "_params" | "_loadState" | "_fetch" | "_response"
    >(this, {
      _response: observable,
      response: computed,
      _params: observable,
      _loadState: observable,
      loadState: computed,
      _fetch: action,
      fetch: action.bound,
      data: computed,
      error: computed,
    });
    this._depsProvider = depsProvider;
    this._fetchReaction = reaction(
      () => this._fetchDepsExpression(),
      (deps) => {
        const checkedDeps = this._checkFetchDeps(deps);
        if (!checkedDeps) return;
        this._fetch(checkedDeps);
      },
      // trigger reaction even when fetch deps are not changed
      // and fetch starts during init phase in dependant stores
      { fireImmediately: true }
    );
  }

  get loadState(): LoadState {
    if (this._loadState === StartState.Start)
      return LoadState.Loading;
    return this._loadState;
  }

  get response() {
    return this._response;
  }
  // type checks won't work for data/error
  // since any is assumed to be returned
  // correct typings are inferred in subclassed usages
  get data(): ApiSuccessData<Response> | undefined {
    if (!this._response || this._response.isError) return undefined;
    return this._response.data;
  }

  get error(): ApiErrorData<Response> | undefined {
    if (!this._response || !this._response.isError) return undefined;
    return this._response.data;
  }

  destroy() {
    this._fetchReaction();
  }

  private _fetchDepsExpression(): FetchDepsInternal<DepsFetchParams> {
    return {
      loadState: this._loadState,
      fetchDeps: this._depsProvider.getFetchDeps(),
    };
  }

  private _checkFetchDeps({
    loadState,
    fetchDeps,
  }: FetchDepsInternal<DepsFetchParams>):
    | FetchParams<OwnFetchParams, Required<DepsFetchParams>>
    | undefined {
    log("checkFetchDeps", { loadState, fetchDeps, id: this.id });
    if (loadState !== StartState.Start) return undefined;
    // params are undefined if unset, null if empty, object if provided
    if (this._params === undefined) return undefined;
    if (
      isObject(fetchDeps) &&
      Object.values(fetchDeps).some((el) => el === undefined)
    )
      return undefined;
    return {
      // won't work without cast: could be another subtype of constraint
      ...(this._params as OwnFetchParams),
      ...(fetchDeps as Required<DepsFetchParams>),
    };
  }

  /**
   * Fetch api resource
   * @param params - combination of own params and non-nullable dependencies
   * @return ApiResponse
   */
  protected abstract _fetchApi(
    params: FetchParams<OwnFetchParams, Required<DepsFetchParams>>
  ): Promise<Response>;

  private async _fetch(
    params: FetchParams<OwnFetchParams, Required<DepsFetchParams>>
  ) {
    this._loadState = LoadState.Loading;
    const response = await this._fetchApi(params);
    if (response.isError) {
      runInAction(() => {
        this._loadState = LoadState.Error;
        this._response = response;
      });
    } else {
      runInAction(() => {
        this._loadState = LoadState.Success;
        this._response = response;
      });
    }
  }

  fetch(params: OwnFetchParams) {
    this._loadState = StartState.Start;
    if (!isObject(params)) {
      this._params = null;
    } else {
      this._params = params;
    }
  }
}
