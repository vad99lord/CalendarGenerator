import {
  BirthdaysCalendarRootNavigation,
  INITIAL_USERS_PICKER_PANELS_STATE,
} from "@routes/types/navigation/root";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { Disposable } from "@utils/types";
import { action, makeObservable } from "mobx";
import { updateView } from "../utils";

export default class CalendarGeneratorStore implements Disposable {
  private readonly _checkedUsersStore: ICheckedUsersStore;
  private readonly _navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>;

  constructor(
    checkedUsersStore: ICheckedUsersStore,
    navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>
  ) {
    this._checkedUsersStore = checkedUsersStore;
    this._navStackStore = navStackStore;
    makeObservable(this, {
      setChooseUsersPanel: action.bound,
    });
  }

  setChooseUsersPanel() {
    this._checkedUsersStore.clear();
    this._navStackStore.backUpTo((state) => {
      return (
        state.viewsState["users_picker"].activePanel ===
        "choose_users"
      );
    });
    this._navStackStore.replace((prevState) =>
      updateView(prevState, "users_picker", (viewState) => ({
        ...viewState,
        panelsState: INITIAL_USERS_PICKER_PANELS_STATE,
      }))
    );
  }

  destroy() {}
}
