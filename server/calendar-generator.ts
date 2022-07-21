import ical from "ical-generator";

export const createCalendar = () => {
  const calendar = ical({ name: "test iCal" });
  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(startTime.getHours() + 1);
  calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: "Example Event",
    description: "It works ;)",
    location: "my room",
    url: "http://sebbo.net/",
  });
  return calendar;
};

export const test = () => {
  return "some message";
};
