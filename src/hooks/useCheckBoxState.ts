import { useCallback, useMemo, useReducer, useState } from "react";

export type CheckBoxInitialState = {
  defaultChecked: boolean;
  defaultEnabled?: boolean;
  defaultIgnoreEnabled?: boolean;
};

export type CheckBoxState = {
  isChecked: boolean;
  isCheckable: boolean;
  setIsChecked: (isChecked: boolean) => void;
  onCheckChanged: () => void;
  setIsEnabled: (isEnabled: boolean) => void;
  setIsIgnoreEnabled: (isIgnoreEnabled: boolean) => void;
};

/*
CB state:
1. can be selected/enabled => 
  1. isChecked : works
2. can't be selected/enabled => 
  1. isChecked : doesn't work
3. enabled ignore =>
  isChecked: works === 1
*/

type CheckState = {
  isCheckable: boolean;
  isChecked: boolean;
};

type CheckActionType =
  | { type: "setIsCheckable"; payload: boolean }
  | { type: "setIsChecked"; payload: boolean }
  | { type: "toggleChecked" };

function checkReducer(
  state: CheckState,
  action: CheckActionType
): CheckState {
  switch (action.type) {
    case "setIsCheckable": {
      const isCheckable = action.payload;
      return {
        ...state,
        isCheckable: isCheckable,
        isChecked: isCheckable ? state.isChecked : false,
      };
    }
    case "setIsChecked": {
      if (!state.isCheckable) return state;
      return { ...state, isChecked: action.payload };
    }
    case "toggleChecked": {
      if (!state.isCheckable) return state;
      return { ...state, isChecked: !state.isChecked };
    }
  }
}

const useCheckBoxState = ({
  defaultChecked,
  defaultEnabled = true,
  defaultIgnoreEnabled = false,
}: CheckBoxInitialState): CheckBoxState => {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [isIgnoreEnabled, setIsIgnoreEnabled] = useState(
    defaultIgnoreEnabled
  );
  const [cbState, cbDispatch] = useReducer(checkReducer, {
    isCheckable: defaultEnabled,
    isChecked: defaultChecked,
  });

  //useMemo runs before commit phase => sets correct
  //checked-isCheckable invariant before being shown on screen
  useMemo(() => {
    const isCheckable = isEnabled || isIgnoreEnabled;
    cbDispatch({ type: "setIsCheckable", payload: isCheckable });
  }, [isEnabled, isIgnoreEnabled]);

  const onCheckChanged = useCallback(() => {
    cbDispatch({ type: "toggleChecked" });
  }, []);
  const setForceIsChecked = useCallback((isChecked: boolean) => {
    cbDispatch({ type: "setIsChecked", payload: isChecked });
  }, []);
  return {
    isChecked: cbState.isChecked,
    isCheckable: cbState.isCheckable,
    setIsChecked: setForceIsChecked,
    onCheckChanged,
    setIsEnabled,
    setIsIgnoreEnabled,
  };
};

export default useCheckBoxState;
