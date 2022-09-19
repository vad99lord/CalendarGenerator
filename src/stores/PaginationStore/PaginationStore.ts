import { ApiResponse } from "@network/types/ApiResponse";
import IFetchStore from "@stores/FetchStores/IFetchStore";
import { PaginationParams } from "@stores/FetchStores/VkApiFetchStore/VkApiParamsProvider/VkApiParamsProviderMap";
import {
  action,
  autorun,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  toJS,
} from "mobx";
import { IPaginationStore } from "./IPaginationStore";
import { PaginationOuterFetchParamsProvider } from "./PaginationOuterFetchParams";
import Range from "./Range";

type PaginationOwnFetchParams = PaginationParams;

export type PaginationOuterFetchParams<
  Store extends IPaginationFetchStore<any, any, any>
> = Store extends IFetchStore<infer Params, any>
  ? Params extends PaginationOwnFetchParams
    ? Omit<Params, keyof PaginationOwnFetchParams>
    : never
  : never;

export type PaginationItem<
  Store extends IPaginationFetchStore<any, any, any>
> = Store extends IPaginationFetchStore<any, infer Item, any>
  ? Item
  : never;

export type PaginationError<
  Store extends IPaginationFetchStore<any, any, any>
> = Store extends IPaginationFetchStore<any, any, infer ErrorData>
  ? ErrorData
  : never;

export interface PaginationFetchResponse<Item> {
  count?: number;
  items?: Item[];
}

export type IPaginationFetchStore<
  Params extends PaginationOwnFetchParams,
  Item,
  ErrorData
> = IFetchStore<
  Params,
  ApiResponse<PaginationFetchResponse<Item>, ErrorData>
>;

export type PaginationConfig = {
  initialLoadSize?: number;
  loadSize?: number;
  itemsPerPage?: number;
};

/*
assumptions/constraints:
1. count in loads is always stable and indicates total items for pagination
2. fetching first item is always at the top of the page
3. only last page may be partially full
4. pages indices start at 1
5. load sizes should be multiple of itemsPerPage, with loadSize >= 3x itemsPerPage
6. cached pages are reset on each new fetch, before actual fetch
7. pagination ui is blocked during fetch (can't change current page until loaded)
8. first load fetches initialLoad items forward 
9. subsequent loads fetch loadSize items centered across the current page
*/
export default class PaginationStore<
  FetchStore extends IPaginationFetchStore<any, any, any>,
  Item extends PaginationItem<FetchStore>,
  OuterFetchParams extends PaginationOuterFetchParams<FetchStore>,
  ErrorData extends PaginationError<FetchStore>
> implements IPaginationStore<Item, ErrorData>
{
  private readonly _fetchStore: IPaginationFetchStore<
    PaginationOwnFetchParams & OuterFetchParams,
    Item,
    ErrorData
  >;
  private _fetchParams!: OuterFetchParams;
  private readonly _initialLoadSize: number;
  private readonly _loadSize: number;
  private readonly _itemsPerPage: number;
  private _currentPage: number = 1;
  private _loadedPages: Range = Range.EMPTY;
  private _fetchNewPagesReaction: IReactionDisposer;
  private _loadedPagesReaction: IReactionDisposer;
  private _fetchParamsLoadReaction: IReactionDisposer;
  constructor(
    fetchStore: FetchStore,
    fetchParamsProvider: PaginationOuterFetchParamsProvider<OuterFetchParams>,
    {
      initialLoadSize = 30,
      loadSize = 25,
      itemsPerPage = 5,
    }: PaginationConfig = {}
  ) {
    this._fetchStore = fetchStore;
    this._validateConfig({ initialLoadSize, loadSize, itemsPerPage });
    this._initialLoadSize = initialLoadSize;
    this._loadSize = loadSize;
    this._itemsPerPage = itemsPerPage;

    makeObservable<
      PaginationStore<any, any, never, any>,
      | "_offset"
      | "_initialLoad"
      | "_load"
      | "_currentLoad"
      | "_setLoadedPages"
      | "_resetLoadedPages"
      | "_currentPageInLoad"
      | "_offsetInLoad"
      | "_loadedPages"
      | "_currentPage"
      | "_currentLoadPage"
      | "_currentPageLoaded"
    >(this, {
      pagesCount: computed,
      _offset: computed,
      _initialLoad: action.bound,
      _load: action.bound,
      _currentLoad: computed,
      _setLoadedPages: action.bound,
      _currentPageLoaded: computed,
      _currentPageInLoad: computed,
      _offsetInLoad: computed,
      pageItems: computed,
      setCurrentPage: action.bound,
      _resetLoadedPages: action.bound,
      loadState: computed,
      currentPage: computed,
      _loadedPages: observable,
      _currentPage: observable,
      _currentLoadPage: computed,
      refresh: action.bound,
      retry: action.bound,
    });
    this._fetchNewPagesReaction = reaction(
      () => this._currentPageLoaded,
      (currentPageLoaded) => {
        console.log("_fetchNewPagesReaction", currentPageLoaded);
        if (!currentPageLoaded) {
          this._load();
        }
      }
    );
    this._loadedPagesReaction = reaction(
      () => this._currentLoad,
      (currentLoad) => {
        console.log(
          "_loadedPagesReaction",
          toJS(currentLoad),
          toJS(this._pagesInLoad)
        );
        this._setLoadedPages();
      }
    );
    this._fetchParamsLoadReaction = reaction(
      () => fetchParamsProvider.getOuterFetchParams(),
      (fetchParams) => {
        console.log("fetchParamsReaction", fetchParams);
        this._setFetchParams(fetchParams);
        this._initialLoad();
      },
      {
        fireImmediately: true,
      }
    );
    autorun(() => {
      const state = {
        initialLoadSize: toJS(this._initialLoadSize),
        loadSize: toJS(this._loadSize),
        itemsPerPage: toJS(this._itemsPerPage),
        pagesCount: toJS(this.pagesCount),
        offset: toJS(this._offset),
        currentLoad: toJS(this._currentLoad),
        pagesInLoad: toJS(this._pagesInLoad),
        currentPageInLoad: toJS(this._currentPageInLoad),
        offsetInLoad: toJS(this._offsetInLoad),
        pageItems: toJS(this.pageItems),
        currentPage: toJS(this.currentPage),
        loadState: toJS(this.loadState),
        loadedPages: toJS(this._loadedPages),
        currentLoadPage: toJS(this._currentLoadPage),
      };
      console.log(state);
    });
  }

  private _validateConfig(config: Required<PaginationConfig>) {
    //Rules:
    //1. should be positive values
    //2. load sizes should be multiple of itemsPerPage
    //3. loadSize >= 3x itemsPerPage
    if (Object.values(config).some((it) => it <= 0)) {
      throw Error("should be positive");
    }
    const { initialLoadSize, loadSize, itemsPerPage } = config;
    if (
      loadSize % itemsPerPage !== 0 ||
      initialLoadSize % itemsPerPage !== 0
    ) {
      throw new Error("not multiple");
    }
    if (Math.floor(loadSize / itemsPerPage) < 3)
      throw new Error("less than 3x times bigger");
  }

  private _setFetchParams(params: OuterFetchParams) {
    this._fetchParams = params;
  }

  get pagesCount() {
    if (!this._currentLoad) return 0;
    return Math.ceil(this._currentLoad.count / this._itemsPerPage);
  }

  private get _loadSizePages() {
    return Math.ceil(this._loadSize / this._itemsPerPage);
  }

  //offset from current page to fetch from
  private get _currentLoadPage() {
    //favor forward prefetch in case of even load pages count
    const currentLoadPage =
      this._currentPage - Math.floor((this._loadSizePages - 1) / 2);
    return Math.max(1, currentLoadPage);
  }

  //points at the start of the page to be loaded
  private get _offset() {
    return (
      Math.max(0, this._currentLoadPage - 1) * this._itemsPerPage
    );
  }

  private _initialLoad() {
    this.setCurrentPage(1);
    this._resetLoadedPages();
    this._fetchStore.fetch({
      offset: this._offset,
      count: this._initialLoadSize,
      ...this._fetchParams,
    });
  }

  private _load() {
    this._resetLoadedPages();
    this._fetchStore.fetch({
      offset: this._offset,
      count: this._loadSize,
      ...this._fetchParams,
    });
  }

  retry() {
    if (this.currentPage === 1) {
      this._initialLoad();
    } else {
      this._load();
    }
  }

  refresh() {
    this._initialLoad();
  }

  private get _currentLoad():
    | Required<PaginationFetchResponse<Item>>
    | undefined {
    if (!this._fetchStore.data) return undefined;
    return {
      count: this._fetchStore.data.count ?? 0,
      items: this._fetchStore.data.items ?? [],
    };
  }

  private get _pagesInLoad() {
    if (!this._currentLoad || !this._currentLoad.items.length)
      return 0;
    const itemsCount = this._currentLoad.items.length;
    const pagesInLoad = Math.ceil(itemsCount / this._itemsPerPage);
    return pagesInLoad;
  }

  private _resetLoadedPages() {
    this._loadedPages = Range.EMPTY;
  }

  private _setLoadedPages() {
    const pagesInLoad = this._pagesInLoad;
    if (pagesInLoad === 0) {
      this._loadedPages = Range.EMPTY; //no loaded pages yet
    }
    const loadStartPage = this._currentLoadPage;
    this._loadedPages = new Range(
      loadStartPage,
      Math.max(loadStartPage, loadStartPage + pagesInLoad - 1)
    );
  }

  private get _currentPageLoaded() {
    return this._loadedPages.contains(this._currentPage);
  }

  private get _currentPageInLoad() {
    console.log(
      "_currentPageInLoad",
      toJS(this._currentPage),
      toJS(this._loadedPages)
    );
    //currentPage is out of loaded pages range => undefined
    if (!this._currentPageLoaded) return undefined;
    return Math.max(
      1,
      this._currentPage - this._loadedPages.start + 1
    );
  }

  private get _offsetInLoad() {
    if (this._currentPageInLoad === undefined) return undefined;
    return (
      Math.max(0, this._currentPageInLoad - 1) * this._itemsPerPage
    );
  }

  get pageItems() {
    console.log(
      "pageItems",
      toJS(this._offsetInLoad),
      toJS(this._currentLoad)
    );
    if (!this._currentPageLoaded) return [];
    if (this._offsetInLoad === undefined || !this._currentLoad)
      return [];
    console.log("NEW pageItems");
    return this._currentLoad.items.slice(
      this._offsetInLoad,
      this._offsetInLoad + this._itemsPerPage
    );
  }

  private get _pagesRange() {
    return new Range(0, this.pagesCount);
  }

  setCurrentPage(page: number) {
    const pagesRange = this._pagesRange;
    if (
      !pagesRange.equals(Range.EMPTY) &&
      !pagesRange.contains(page)
    ) {
      throw new RangeError(
        `page ${page} is out of valid range ${pagesRange}`
      );
    }
    this._currentPage = page;
  }

  get currentPage() {
    return this._currentPage;
  }

  get loadState() {
    return this._fetchStore.loadState;
  }

  get error() {
    return this._fetchStore.error;
  }

  destroy() {
    this._fetchParamsLoadReaction();
    this._fetchNewPagesReaction();
    this._loadedPagesReaction();
  }
}
