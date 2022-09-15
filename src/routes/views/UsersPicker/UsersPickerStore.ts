import { PickerDate } from "@components/BirthdayPicker/BirthdayPicker";
import { BirthDate } from "@network/models/Birthday/Birthday";
import { UserModel } from "@network/models/User/UserModel";
import { BirthdaysCalendarRootNavigation } from "@routes/types/navigation/root";
import { ChooseUsersTabs } from "@routes/types/navigation/tabs";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { Disposable } from "@utils/types";
import { action, makeObservable } from "mobx";
import { updateView } from "../utils";

export default class UsersPickerStore implements Disposable {
  private readonly _checkedUsersStore: ICheckedUsersStore;
  private readonly _navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>;

  constructor(
    checkedUsersStore: ICheckedUsersStore,
    navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>
  ) {
    this._checkedUsersStore = checkedUsersStore;
    this._navStackStore = navStackStore;
    makeObservable(this, {
      setEditDatesPanel: action.bound,
      setGenerateCalendarPanel: action.bound,
      onChooseUserTabChange: action.bound,
      onOpenCheckedUsers: action.bound,
      onUserDateChange: action.bound,
      setChooseUsersPanel: action.bound,
    });
  }

  setEditDatesPanel() {
    this._navStackStore.next((prevState) =>
      updateView(prevState, "users_picker", (viewState) => ({
        ...viewState,
        activePanel: "edit_dates",
      }))
    );
  }

  setChooseUsersPanel() {
    this._navStackStore.next((prevState) =>
      updateView(prevState, "users_picker", (viewState) => ({
        ...viewState,
        activePanel: "choose_users",
      }))
    );
  }

  setGenerateCalendarPanel() {
    this._navStackStore.next((prevState) =>
      updateView(
        {
          ...prevState,
          activeView: "calendar_generator",
        },
        "calendar_generator",
        (viewState) => ({
          ...viewState,
          activePanel: "generate_calendar",
        })
      )
    );
  }

  onOpenCheckedUsers() {
    this._navStackStore.next((prevState) =>
      updateView(prevState, "users_picker", (viewState) => ({
        ...viewState,
        activePanel: "selected_users",
      }))
    );
  }

  onChooseUserTabChange(activeTab: ChooseUsersTabs) {
    this._navStackStore.replace((prevState) =>
      updateView(prevState, "users_picker", (viewState) => ({
        ...viewState,
        panelsState: {
          choose_users: {
            activeTab: activeTab,
          },
        },
      }))
    );
  }

  onUserDateChange(date: PickerDate, user: UserModel) {
    const userWithDate = { ...user, birthday: new BirthDate(date) };
    this._checkedUsersStore.setChecked(true, userWithDate);
  }

  destroy() {}
}
