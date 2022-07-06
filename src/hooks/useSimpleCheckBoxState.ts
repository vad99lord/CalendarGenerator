import { useCallback, useState } from "react";

const useSimpleCheckBoxState = (initialState: boolean) => {
  const [isChecked, setIsChecked] = useState(initialState);
  const onCheckChanged = useCallback(() => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  }, []);
  return [isChecked, onCheckChanged] as const;
};

export default useSimpleCheckBoxState;
