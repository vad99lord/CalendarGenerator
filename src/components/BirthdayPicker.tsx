import {
  DatePicker,
  DatePickerDateFormat,
  FormItem,
  FormItemProps,
  SizeType,
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

export type BirthdayPickerProps = {
  minDate?: FullDate;
  maxDate?: FullDate;
  acceptYear: boolean;
  onDateChange?: (newDate: PickerDate) => void;
};

const BirthdayPicker = ({
  minDate = { day: 1, month: 1, year: 1920 },
  maxDate = { day: 1, month: 1, year: 2020 },
  acceptYear = true,
  onDateChange,
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
  console.log({ minDate, maxDate, acceptYear });

  return (
    <FormItem status={dateFieldState}>
      <DatePicker
        className={acceptYear ? undefined : "BirthdayPicker__no-year"}
        min={minDate}
        max={maxDate}
        yearPlaceholder="ГГГГ"
        monthPlaceholder="ММ"
        dayPlaceholder="ДД"
        onDateChange={onDateChangeCallback}
        sizeY={SizeType.COMPACT} //TODO check why warning on lacking dom prop
        popupDirection="bottom"
      />
    </FormItem>
  );
};

export default BirthdayPicker;
