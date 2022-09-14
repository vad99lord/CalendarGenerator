import { CalendarGeneratorPanelsIds, UsersPickerPanelNavigationState, UsersPickerPanelsIds } from "./panels";

export const BirthdaysCalendarViews = {
  UsersPicker: "users_picker",
  CalendarGenerator: "calendar_generator",
} as const;

export type BirthdaysCalendarViewsIds =
  typeof BirthdaysCalendarViews[keyof typeof BirthdaysCalendarViews];

export type ViewNavigation<PanelIds> = {
  activePanel: PanelIds;
};
export type UsersPickerViewNavigation = {
  panelsState: UsersPickerPanelNavigationState;
} & ViewNavigation<UsersPickerPanelsIds>;

export type CalendarGeneratorViewNavigation =
  ViewNavigation<CalendarGeneratorPanelsIds>;

export type ViewNavState<
  Id extends BirthdaysCalendarViewsIds,
  State extends ViewNavigation<any>
> = Record<Id, State>;

export type BirthdaysCalendarViewsNavState = ViewNavState<
  "users_picker",
  UsersPickerViewNavigation
> &
  ViewNavState<"calendar_generator", CalendarGeneratorViewNavigation>;


