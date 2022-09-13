import { LoadState } from "@stores/LoadState";
import { Disposable } from "@utils/types";

export interface IPaginationStore<Item> extends Disposable {
  pagesCount: number;
  pageItems: Item[];
  currentPage: number;
  loadState: LoadState;
  setCurrentPage(page: number): void;
}
