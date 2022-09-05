import { PickerDate } from "@components/BirthdayPicker/BirthdayPicker";
import { BirthDate } from "@network/models/Birthday/Birthday";
import { UserModel } from "@network/models/User/UserModel";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { Disposable } from "@utils/types";
import { action, makeObservable } from "mobx";
import ICheckedUsersStore from "../../stores/CheckedUsersStore/ICheckedUsersStore";
import { ChooseUsersTabs } from "../ChooseUsers/ChooseUsers";
import { ViewNavigation } from "./UsersPicker";

export default class UsersPickerStore implements Disposable {
  private readonly _checkedUsersStore: ICheckedUsersStore;
  private readonly _navStackStore: INonEmptyNavigationStackStore<ViewNavigation>;

  constructor(
    checkedUsersStore: ICheckedUsersStore,
    navStackStore: INonEmptyNavigationStackStore<ViewNavigation>
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
