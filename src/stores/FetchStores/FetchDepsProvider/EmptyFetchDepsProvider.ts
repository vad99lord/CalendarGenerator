import FetchDepsProvider from "./FetchDepsProvider";

const emptyDepsProvider: FetchDepsProvider<void> = {
  getFetchDeps() {
    return null;
  },
};

export default emptyDepsProvider