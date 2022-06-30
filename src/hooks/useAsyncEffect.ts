import { useEffect } from "react";

export const useAsyncEffect = <R>(
  effect: () => Promise<R>,
  deps: any[],
  destroy: ((result: R) => any) | undefined = undefined
) => {
  console.log(effect, destroy, deps);
  useEffect(() => {
    console.log("useEffect");
    let result: R;

    effect()
      .then((value) => (result = value))
      .catch(console.log);

    return () => {
      if (destroy) {
        destroy(result);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEffect;
