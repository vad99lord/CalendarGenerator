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
