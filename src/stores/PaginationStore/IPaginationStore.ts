import { LoadState } from "@stores/LoadState";
import { Disposable } from "@utils/types";

export interface IPaginationStore<Item, ErrorData>
  extends Disposable {
  pagesCount: number;
  pageItems: Item[];
  currentPage: number;
  loadState: LoadState;
  error: ErrorData | undefined;
  setCurrentPage(page: number): void;
  refresh(): void;
  retry(): void;
}
