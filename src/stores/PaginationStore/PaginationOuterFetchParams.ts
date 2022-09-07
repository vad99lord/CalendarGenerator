export interface PaginationOuterFetchParamsProvider<
  PaginationOuterFetchParams
> {
  getOuterFetchParams(): PaginationOuterFetchParams;
}

export const EmptyOuterFetchParamsProvider: PaginationOuterFetchParamsProvider<{}> =
  {
    getOuterFetchParams() {
      return {};
    },
  };
