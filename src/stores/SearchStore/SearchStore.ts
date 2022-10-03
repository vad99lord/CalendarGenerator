import { Disposable } from "@utils/types";
import debounce from "lodash.debounce";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from "mobx";
import { ChangeEvent } from "react";
import ISearchStore from "./ISearchStore";

type InitialState = {
  initialText?: string;
  waitTime?: number;
};

export default class SearchStore implements ISearchStore, Disposable {
  private _searchText!: string;
  private _debouncedSearchText!: string;
  private readonly _debouncedSearchTextReaction: IReactionDisposer;
  private readonly _waitTime: number;

  constructor({
    initialText = "",
    waitTime = 500,
  }: InitialState = {}) {
    this._waitTime = waitTime;
    makeObservable<
      SearchStore,
      | "_searchText"
      | "_setSearchText"
      | "_debouncedSearchText"
      | "_setDebouncedSearchText"
      | "_init"
    >(this, {
      _searchText: observable,
      searchText: computed,
      _setSearchText: action.bound,
      onSearchTextChange: action.bound,
      _debouncedSearchText: observable,
      debouncedSearchText: computed,
      _setDebouncedSearchText: action.bound,
      _init: action.bound,
    });
    this._debouncedSearchTextReaction = reaction(
      () => this._searchText,
      debounce((searchText: string) => {
        this._setDebouncedSearchText(searchText);
      }, this._waitTime)
    );
    // reaction won't be triggered
    // on initial observable set =>
    // init search and debounced fields manually
    this._init(initialText);
  }

  private _init(initText: string) {
    this._setSearchText(initText);
    this._setDebouncedSearchText(initText);
  }

  private _setSearchText(searchText: string) {
    this._searchText = searchText;
  }

  private _setDebouncedSearchText(searchText: string) {
    this._debouncedSearchText = searchText;
  }

  get searchText() {
    return this._searchText;
  }

  onSearchTextChange(event: ChangeEvent<HTMLInputElement>) {
    const searchFieldString = event.target.value;
    this._setSearchText(searchFieldString);
  }

  get debouncedSearchText() {
    return this._debouncedSearchText;
  }

  destroy() {
    this._debouncedSearchTextReaction();
  }
}
