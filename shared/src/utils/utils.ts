export const createUTCDate = (
  ...dateParams: Parameters<DateConstructor["UTC"]>
) => new Date(Date.UTC(...dateParams));
