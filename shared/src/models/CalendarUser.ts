export type CalendarUserApi = {
  name: string;
  birthday: string;
  id: string | null;
};

export type CalendarUserApiRequest = {
  birthdays: CalendarUserApi[];
};

export type CalendarUser = {
  name: string;
  birthday: Date;
  id: string | null;
};
