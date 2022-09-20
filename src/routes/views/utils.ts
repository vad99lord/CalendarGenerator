import { BirthdaysCalendarRootNavigation } from "@routes/types/navigation/root";
import {
  BirthdaysCalendarViewsIds,
  BirthdaysCalendarViewsNavState,
} from "@routes/types/navigation/views";
import { Updater } from "@stores/NavigationStackStore/INavigationStackStore";
import { deepCloneJson } from "@utils/utils";

export const updateView = <ViewId extends BirthdaysCalendarViewsIds>(
  prevState: BirthdaysCalendarRootNavigation,
  viewId: ViewId,
  updater: Updater<BirthdaysCalendarViewsNavState[ViewId]>
) => {
  const currentState = deepCloneJson(prevState);
  let currentViewState = currentState.viewsState[viewId];
  currentState.viewsState[viewId] = updater(currentViewState);
  return currentState;
};
