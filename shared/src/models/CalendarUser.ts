export type CalendarUserApi = {
  name: string;
  birthday: string;
};

export type CalendarUserApiRequest = {
  birthdays: CalendarUserApi[];
};

export type CalendarUser = {
  name: string;
  birthday: Date;
};
