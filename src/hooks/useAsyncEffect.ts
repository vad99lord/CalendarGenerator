import { useEffect } from "react";

export const useAsyncEffect = <R>(
  effect: () => Promise<R>,
  deps: any[],
  destroy: ((result: R) => any) | undefined = undefined
) => {
  useEffect(() => {
    console.log("useAsyncEffect");
    console.log({ effect, destroy, deps });
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
