import {
  DatePicker,
  DatePickerDateFormat,
  DatePickerProps,
  FormItem,
  FormItemProps,
} from "@vkontakte/vkui";
import { useCallback, useState } from "react";

import "./BirthdayPicker.css";

export type FullDate = DatePickerDateFormat;

export type DayMonthDate = Omit<FullDate, "year">;

export type PickerDate = FullDate | DayMonthDate;

export const isFullDate = (date: PickerDate): date is FullDate =>
  (date as FullDate).year !== undefined;

type FormFieldStatus = NonNullable<FormItemProps["status"]>;

const isValidDate = (
  date: DatePickerDateFormat,
  skipYear: boolean
) => {
  if (date.day === 0 || date.month === 0) return false;
  if (skipYear) return true;
  return date.year !== 0;
};

export interface BirthdayPickerProps
  extends Omit<
    DatePickerProps,
    | "yearPlaceholder"
    | "monthPlaceholder"
    | "dayPlaceholder"
    | "onDateChange"
    | "defaultValue"
  > {
  min?: FullDate;
  max?: FullDate;
  acceptYear?: boolean;
  onDateChange?: (newDate: PickerDate) => void;
  defaultDate?: PickerDate;
}

const BirthdayPicker = ({
  min = { day: 1, month: 1, year: 1920 },
  max = { day: 1, month: 1, year: 2020 },
  acceptYear = true,
  onDateChange,
  defaultDate,
  className,
  ...props
}: BirthdayPickerProps) => {
  const [dateFieldState, setDateFieldState] =
    useState<FormFieldStatus>("default");

  const onDateChangeCallback = useCallback(
    (newDate: DatePickerDateFormat) => {
      if (!isValidDate(newDate, !acceptYear)) {
        setDateFieldState("error");
        return;
      }
      setDateFieldState("valid");
      if (acceptYear) {
        onDateChange?.(newDate);
      } else {
        const { year, ...date } = newDate;
        onDateChange?.(date);
      }
    },
    [acceptYear, onDateChange]
  );
  // console.log({ min, max, acceptYear });
  const pickerClassName = [
    className,
    acceptYear ? undefined : "BirthdayPicker__no-year",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormItem status={dateFieldState}>
      <DatePicker
        className={pickerClassName}
        min={min}
        max={max}
        yearPlaceholder="ГГГГ"
        monthPlaceholder="ММ"
        dayPlaceholder="ДД"
        onDateChange={onDateChangeCallback}
        defaultValue={
          defaultDate ? { year: min.year, ...defaultDate } : undefined
        }
        {...props}
      />
    </FormItem>
  );
};

export default BirthdayPicker;
