import { CalendarUser } from "@shared/models/CalendarUser";
import { getProfileUrl } from "@shared/utils/utils";
import ical, { ICalEventRepeatingFreq } from "ical-generator";

export const createBirthdayCalendar = (users: CalendarUser[]) => {
  const calendar = ical({ name: "VK friends birthdays" });
  users.forEach((user) => {
    calendar.createEvent({
      start: user.birthday,
      allDay: true,
      summary: `🎉 ${user.name}`,
      description: user.id ? getProfileUrl(user.id) : null,
      repeating: {
        freq: ICalEventRepeatingFreq.YEARLY,
      },
    });
  });
  return calendar;
};
