import ical, { ICalEventRepeatingFreq } from "ical-generator";

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

export const createBirthdayCalendar = (users: CalendarUser[]) => {
  const calendar = ical({ name: "VK friends birthdays" });
  users.forEach((user) => {
    calendar.createEvent({
      start: user.birthday,
      allDay: true,
      summary: user.name,
      repeating: {
        freq: ICalEventRepeatingFreq.YEARLY,
      },
    });
  });
  return calendar;
};
