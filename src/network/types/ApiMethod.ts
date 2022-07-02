export type ApiMethod<
  N extends string,
  P extends any,
  R extends any
> = Record<N, { params: P; response: R }>;
