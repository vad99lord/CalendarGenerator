import { UsersPickerPanelNavigationState } from "./panels";
import {
  BirthdaysCalendarViewsIds,
  BirthdaysCalendarViewsNavState,
} from "./views";

export type RootNavigation<ViewIds> = {
  activeView: ViewIds;
};

export type BirthdaysCalendarRootNavigation = {
  viewsState: BirthdaysCalendarViewsNavState;
} & RootNavigation<BirthdaysCalendarViewsIds>;

export const INITIAL_USERS_PICKER_PANELS_STATE: UsersPickerPanelNavigationState =
  {
    choose_users: {
      activeTab: "FRIENDS",
    },
  };

export const INITIAL_NAV_STATE: BirthdaysCalendarRootNavigation = {
  activeView: "users_picker",
  viewsState: {
    users_picker: {
      activePanel: "user_auth",
      panelsState: INITIAL_USERS_PICKER_PANELS_STATE,
    },
    calendar_generator: {
      activePanel: "generate_calendar",
    },
  },
};
