// non-nested promise unwrapping
export type FlatAwaited<T> = T extends PromiseLike<infer U> ? U : T;

// enables indexing for interfaces to pass as object props
export type DeepIndexSignature<O extends object> = {
  [P in keyof O]: O[P] extends object
    ? DeepIndexSignature<O[P]>
    : O[P];
};
