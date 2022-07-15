import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "use-debounce";

const useSearchState = (waitTimeMs: number = 500) => {
  const [searchText, setSearchText] = useState("");

  const [debouncedSearchText] = useDebounce(searchText, waitTimeMs);

  const onSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const searchFieldString = event.target.value;
      setSearchText(searchFieldString);
    },
    []
  );
  return [debouncedSearchText, searchText, onSearchChange] as const;
};

export default useSearchState;
