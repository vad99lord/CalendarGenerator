export const createUTCDate = (
  ...dateParams: Parameters<DateConstructor["UTC"]>
) => new Date(Date.UTC(...dateParams));

export const LEAP_YEAR_LAST_FEBRUARY = {
  month: 2,
  day: 29,
};

/**
 *
 * @param month - 0-based month number
 * @param day - day of the month
 */
export const isLeapYearLastFebruary = (month: number, day: number) =>
  month + 1 === LEAP_YEAR_LAST_FEBRUARY.month &&
  day === LEAP_YEAR_LAST_FEBRUARY.day;

export const isDevEnv = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
