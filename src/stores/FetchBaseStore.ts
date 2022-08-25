import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { ApiResponse } from "../network/types/ApiResponse";
import { Disposable } from "../utils/types";
import { LoadState, StartState } from "./State";

type FetchParams<OwnParams, DepsParams> = OwnParams & DepsParams;
type InternalLoadState = LoadState | StartState;

type FetchDepsInternal<Deps> = {
  loadState: InternalLoadState;
  fetchDeps: Deps;
};


const log = console.log;
export default abstract class FetchBaseStore<
  OwnFetchParams extends object,
  DepsFetchParams extends object,
  Response extends ApiResponse
> implements Disposable
{
  response?: Response = undefined;
  _loadState: InternalLoadState = LoadState.Initial;
  private _fetchReaction: IReactionDisposer;
  _params?: OwnFetchParams = undefined;
  id = Math.random();

  constructor() {
    makeObservable(this, {
      response: observable,
      _params: observable,
      _loadState: observable,
      loadState: computed,
      _fetch: action,
      fetch: action.bound,
    });
    this._fetchReaction = reaction(
      () => this._fetchDepsExpression(),
      (deps) => {
        const checkedDeps = this._checkFetchDeps(deps);
        if (!checkedDeps) return;
        this._fetch(checkedDeps);
      }
    );
  }

  get loadState(): LoadState {
    if (this._loadState === StartState.Start)
      return LoadState.Loading;
    return this._loadState;
  }

  destroy() {
    this._fetchReaction();
  }

  private _fetchDepsExpression(): FetchDepsInternal<DepsFetchParams> {
    return {
      loadState: this._loadState,
      fetchDeps: this._getFetchDeps(),
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
    if (!this._params) return undefined;
    if (Object.values(fetchDeps).some((el) => el === undefined))
      return undefined;
    return {
      ...this._params,
      ...(fetchDeps as Required<DepsFetchParams>),
    };
  }

  /**
   * Provides fetch method dependencies
   * @return object with observable dependencies
   */
  protected abstract _getFetchDeps(): DepsFetchParams;

  /**
   * Fetch api resource
   * @param params - combination of own params and non-nullable dependencies
   * @return ApiResponse
   */
  protected abstract _fetchApi(
    params: FetchParams<OwnFetchParams, Required<DepsFetchParams>>
  ): Promise<Response>;

  async _fetch(
    params: FetchParams<OwnFetchParams, Required<DepsFetchParams>>
  ) {
    this._loadState = LoadState.Loading;
    const response = await this._fetchApi(params);
    if (response.isError) {
      runInAction(() => {
        this._loadState = LoadState.Error;
        this.response = response;
      });
    } else {
      runInAction(() => {
        this._loadState = LoadState.Success;
        this.response = response;
      });
    }
  }

  fetch(params: OwnFetchParams) {
    this._loadState = StartState.Start;
    this._params = params;
  }
}
