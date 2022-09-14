import { BirthdaysCalendarRootNavigation } from "@routes/types/navigation/root";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { Disposable } from "@utils/types";
import { makeObservable } from "mobx";

export default class CalendarGeneratorStore implements Disposable {
  private readonly _checkedUsersStore: ICheckedUsersStore;
  private readonly _navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>;

  constructor(
    checkedUsersStore: ICheckedUsersStore,
    navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>
  ) {
    this._checkedUsersStore = checkedUsersStore;
    this._navStackStore = navStackStore;
    makeObservable(this, {});
  }

  destroy() {}
}
