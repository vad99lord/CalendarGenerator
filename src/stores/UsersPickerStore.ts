import { action, computed, makeObservable } from "mobx";
import { PickerDate } from "../components/BirthdayPicker/BirthdayPicker";
import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserModel } from "../network/models/User/UserModel";
import { ChooseUsersTabs } from "../routes/ChooseUsers";
import { ViewNavigation } from "../routes/UsersPicker";
import { Disposable } from "../utils/types";
import CheckedUsersStore from "./CheckedUsersStore";
import { NonEmptyNavStackStore } from "./NavigationStackStore";

export default class UsersPickerStore implements Disposable {
  private _checkedUsersStore: CheckedUsersStore;
  private _navStackStore: NonEmptyNavStackStore<ViewNavigation>;

  constructor(
    checkedUsersStore: CheckedUsersStore,
    navStackStore: NonEmptyNavStackStore<ViewNavigation>
  ) {
    this._checkedUsersStore = checkedUsersStore;
    this._navStackStore = navStackStore;
    makeObservable(this, {
      setEditDatesPanel: action.bound,
      setGenerateCalendarPanel: action.bound,
      onChooseUserTabChange: action.bound,
      onOpenCheckedUsers: action.bound,
      onUserDateChange: action.bound,
    });
  }

  setEditDatesPanel() {
    this._navStackStore.next((prevState) => ({
      ...prevState,
      activePanel: "edit_dates",
    }));
  }

  setGenerateCalendarPanel() {
    this._navStackStore.next((prevState) => ({
      ...prevState,
      activePanel: "generate_calendar",
    }));
  }

  onOpenCheckedUsers() {
    this._navStackStore.next((prevState) => ({
      ...prevState,
      activePanel: "selected_users",
    }));
  }

  onChooseUserTabChange(activeTab: ChooseUsersTabs) {
    this._navStackStore.replace((prevState) => ({
      ...prevState,
      panelsState: {
        choose_users: {
          activeTab: activeTab,
        },
      },
    }));
  }

  onUserDateChange(date: PickerDate, user: UserModel) {
    const userWithDate = { ...user, birthday: new BirthDate(date) };
    this._checkedUsersStore.setChecked(true, userWithDate);
  }

  destroy() {}
}
