import { LoadState } from "@stores/LoadState";

export interface IPaginationStore<Item, ErrorData> {
  pagesCount: number;
  pageItems: Item[];
  currentPage: number;
  loadState: LoadState;
  error: ErrorData | undefined;
  setCurrentPage(page: number): void;
  refresh(): void;
  retry(): void;
}
