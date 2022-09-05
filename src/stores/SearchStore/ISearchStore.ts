import { Disposable } from "@utils/types";
import { ChangeEvent } from "react";

export default interface ISearchStore extends Disposable {
  searchText: string;
  debouncedSearchText: string;
  onSearchTextChange(event: ChangeEvent<HTMLInputElement>): void;
}
