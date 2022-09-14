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

export const INITIAL_NAV_STATE: BirthdaysCalendarRootNavigation = {
  activeView: "users_picker",
  viewsState: {
    users_picker: {
      activePanel: "choose_users",
      panelsState: {
        choose_users: {
          activeTab: "FRIENDS",
        },
      },
    },
    calendar_generator: {
      activePanel: "generate_calendar",
    },
  },
};
