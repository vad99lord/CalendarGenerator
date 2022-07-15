import { useRef } from "react";

const useNoRenderRef = <T>(currentValue: T) => {
  const ref = useRef(currentValue);
  ref.current = currentValue;
  return ref;
};

export default useNoRenderRef;
