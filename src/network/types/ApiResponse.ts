export type ApiSuccess<R = any> = {
  isError: false;
  data: R;
};

export type ApiError<E = any> = {
  isError: true;
  data: E;
};

export type ApiResponse<R = any, E = any> =
  | ApiSuccess<R>
  | ApiError<E>;
