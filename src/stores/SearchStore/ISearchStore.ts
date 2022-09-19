import { ChangeEvent } from "react";

export default interface ISearchStore {
  searchText: string;
  debouncedSearchText: string;
  onSearchTextChange(event: ChangeEvent<HTMLInputElement>): void;
}
