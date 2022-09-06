import { ApiResponse } from "@network/types/ApiResponse";
import IFetchStore from "@stores/FetchStores/IFetchStore";
import { Disposable } from "@utils/types";
import {
  action,
  autorun,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  toJS,
  when,
} from "mobx";

/*
assumptions/constraints:
1. count on initial load indicates total items for pagination
2. fetching first item is always at the top of the page
3. only last page may be partially full
4. pages indices start at 1
5. load sizes should be multiple of itemsPerPage, with loadSize >= 3x itemsPerPage
6. cached pages are reset on each new fetch
7. pagination ui is blocked during fetch (can't change current page until loaded)
8. first load fetches initialLoad items forward 
9. subsequent loads fetch loadSize items centered across the current page
*/

class Range {
  private readonly _start: number;
  private readonly _end: number;
  constructor(start: number, end: number) {
    if (start < 0 || end < start) throw new RangeError("end < start");
    this._start = start;
    this._end = end;
  }
  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  contains(num: number) {
    return num >= this._start && num <= this._end;
  }
}

export interface PaginationFetchResponse<Item> {
  count: number;
  items: Item[];
}

export interface PaginationFetchParams {
  offset: number;
  count: number;
}

export type IPaginationFetchStore<Item> = IFetchStore<
  PaginationFetchParams,
  ApiResponse<PaginationFetchResponse<Item>>
>;

export default class PaginationStore<Item> implements Disposable {
  private readonly _fetchStore: IPaginationFetchStore<Item>;
  private _initialLoadSize: number = 30;
  private _loadSize: number = 25;
  private _itemsPerPage: number = 5;
  private _currentPage: number = 1; //undefined until first load??
  private _totalCount?: number; //or 0 default???
  private _loadedPages: Range = new Range(0, 0);
  private _fetchNewPagesReaction: IReactionDisposer;
  private _loadedPagesReaction: IReactionDisposer;
  private _totalPagesCountReaction: IReactionDisposer;

  constructor(fetchStore: IPaginationFetchStore<Item>) {
    this._fetchStore = fetchStore;
    makeObservable<
      PaginationStore<any>,
      | "_setTotalCount"
      | "_offset"
      | "_initialLoad"
      | "_currentLoad"
      | "_setLoadedPages"
      | "_currentPageInLoad"
      | "_offsetInLoad"
      | "_loadedPages"
      | "_totalCount"
      | "_currentPage"
      | "_currentLoadPage"
    >(this, {
      _setTotalCount: action.bound,
      pagesCount: computed,
      _offset: computed,
      _initialLoad: action.bound,
      _currentLoad: computed,
      _setLoadedPages: action.bound,
      _currentPageInLoad: computed,
      _offsetInLoad: computed,
      pageItems: computed,
      setCurrentPage: action.bound,
      loadState: computed,
      currentPage: computed,
      _loadedPages: observable,
      _totalCount: observable,
      _currentPage: observable,
      _currentLoadPage: computed,
    });
    this._totalPagesCountReaction = when(
      () => this._currentLoad !== undefined,
      () => {
        console.log(
          "_totalPagesCountReaction",
          toJS(this._currentLoad)
        );
        const totalCount = this._currentLoad!.count;
        this._setTotalCount(totalCount);
      }
    );
    this._fetchNewPagesReaction = reaction(
      () => this._currentPage,
      (currentPage) => {
        console.log("_fetchNewPagesReaction", currentPage);
        if (!this._loadedPages.contains(currentPage)) {
          this._fetchStore.fetch({
            offset: this._offset,
            count: this._loadSize,
          });
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
        this._setLoadedPages()
      }
    );
    this._initialLoad();
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

  private _setTotalCount(count: number) {
    this._totalCount = count;
  }

  get pagesCount() {
    if (!this._totalCount) return 0; //undefined??
    return Math.ceil(this._totalCount / this._itemsPerPage);
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
    this._fetchStore.fetch({
      offset: this._offset,
      count: this._initialLoadSize,
    });
    // this.setCurrentPage(1);
  }

  private get _currentLoad() {
    return this._fetchStore.data; // ?? [];
  }

  private get _pagesInLoad() {
    if (!this._currentLoad || !this._currentLoad.items.length)
      return 0; //undefined ???;
    const itemsCount = this._currentLoad.items.length;
    const pagesInLoad = Math.ceil(itemsCount / this._itemsPerPage);
    return pagesInLoad;
  }

  private _setLoadedPages() {
    const pagesInLoad = this._pagesInLoad;
    if (pagesInLoad === 0) {
      this._loadedPages = new Range(0, 0); //no loaded pages yet
    }
    const loadStartPage = this._currentLoadPage;
    this._loadedPages = new Range(
      loadStartPage,
      loadStartPage + pagesInLoad - 1
    );
  }

  private get _currentPageInLoad() {
    console.log(
      "_currentPageInLoad",
      toJS(this._currentPage),
      toJS(this._loadedPages)
    );
    //currentPage is out of loaded pages range => undefined
    if (!this._loadedPages.contains(this._currentPage))
      return undefined;
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
    if (this._offsetInLoad === undefined || !this._currentLoad)
      return [];
    return this._currentLoad.items.slice(
      this._offsetInLoad,
      this._offsetInLoad + this._itemsPerPage
    );
  }

  setCurrentPage(page: number) {
    //todo check page in valid range
    this._currentPage = page;
  }

  get currentPage() {
    return this._currentPage;
  }

  get loadState() {
    return this._fetchStore.loadState;
  }

  destroy() {
    this._totalPagesCountReaction();
    this._fetchNewPagesReaction();
    this._loadedPagesReaction();
  }
}
