// non-nested promise unwrapping
export type FlatAwaited<T> = T extends PromiseLike<infer U> ? U : T;

// enables indexing for interfaces to pass as object props
export type DeepIndexSignature<O extends object> = {
  [P in keyof O]: O[P] extends object
    ? DeepIndexSignature<O[P]>
    : O[P];
};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;

export type OptionalKeys<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;
export type PickOptional<T extends object> = Pick<T, OptionalKeys<T>>;

export type ChildrenProps = {
  children?: React.ReactNode;
};

export interface ClassConstructor<
  Class extends abstract new (...args: any) => any,
  InstanceInterface = never
> {
  new (...args: ConstructorParameters<Class>): InstanceType<Class> &
    InstanceInterface;
}

export interface Disposable {
  destroy: () => void;
}

export type UnionToIntersection<Union> =
  // `extends unknown` is always going to be the case and is used to convert the
  // `Union` into a [distributive conditional
  // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
  (
    Union extends unknown
      ? // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        (distributedUnion: Union) => void
      : // This won't happen.
        never
  ) extends // Infer the `Intersection` type since TypeScript represents the positional
  // arguments of unions of functions as an intersection of the union.
  (mergedIntersection: infer Intersection) => void
    ? Intersection
    : never;
