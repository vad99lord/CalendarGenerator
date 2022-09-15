import { ChooseUsersTabs } from "./tabs";

export const BirthdaysCalendarPanels = {
  ChooseUsers: "choose_users",
  EditDates: "edit_dates",
  GenerateCalendar: "generate_calendar",
  SelectedUsers: "selected_users",
  UserAuth: "user_auth",
} as const;

export type BirthdaysCalendarPanelsIds =
  typeof BirthdaysCalendarPanels[keyof typeof BirthdaysCalendarPanels];

export type PanelNavState<
  Id extends BirthdaysCalendarPanelsIds,
  State
> = Record<Id, State>;

export type UsersPickerPanelsIds = Exclude<
  BirthdaysCalendarPanelsIds,
  "generate_calendar"
>;

export type UsersPickerPanelsNavState<
  Id extends UsersPickerPanelsIds,
  State
> = PanelNavState<Id, State>;

export type UsersPickerPanelNavigationState =
  UsersPickerPanelsNavState<
    "choose_users",
    { activeTab: ChooseUsersTabs }
  >;

export type CalendarGeneratorPanelsIds = Extract<
  BirthdaysCalendarPanelsIds,
  "generate_calendar"
>;
