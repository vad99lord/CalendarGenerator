import { createUTCDate } from "@shared/utils/utils";
import {
  isFullDate,
  PickerDate,
} from "../../../components/BirthdayPicker/BirthdayPicker";
import { Optional } from "../../../utils/types";

const DATE_PARTS = ["day", "month", "year"] as const;

type DateParts = Record<typeof DATE_PARTS[number], number>;

export type BirthDateParts = Optional<DateParts, "year">;

export class BirthDate {
  private readonly birthDate: Date;
  private birthDateParts: BirthDateParts;

  // formatter needs date to properly decline month names
  private static MONTH_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
  });

  constructor(bdate: string);
  constructor(bdate: PickerDate);
  constructor(bdate: string | PickerDate) {
    if (typeof bdate === "string") {
      this.birthDateParts = BirthDate.stringToBirthDateParts(bdate);
    } else {
      const { month, day } = bdate;
      if (isFullDate(bdate)) {
        this.birthDateParts = { year: bdate.year, month, day };
      } else {
        this.birthDateParts = { month, day };
      }
    }
    const { year, month, day } = this.birthDateParts;
    // backing Date field should contain UTC based date to
    // avoid client-server local timezones discrepancies
    this.birthDate = createUTCDate(year ?? 0, month - 1, day);
  }

  public getDay(): number {
    return this.birthDate.getDate();
  }

  public getMonthName(): string {
    // formatter output contains "DD MMMM" => ensured month is last token
    return BirthDate.MONTH_FORMATTER.format(this.birthDate)
      .split(/(\s+)/)
      .pop()!!;
  }

  public getMonthDate(): number {
    return this.birthDate.getMonth() + 1; // 0-based date in Date class
  }

  public getYear(): number | undefined {
    if (!this.birthDateParts.year) return undefined;
    return this.birthDate.getFullYear();
  }

  public toDate(): Date {
    return new Date(this.birthDate);
  }

  /**
   * @param bdate birthday string in a format of D.M.YYYY | D.M,
   * where M = 1..12
   */
  private static stringToBirthDateParts(
    bdate: string
  ): BirthDateParts {
    // console.log(bdate);
    const bdateTokenized = bdate.split(".").map(Number);

    if (
      bdateTokenized.some(isNaN) ||
      bdateTokenized.length < 2 ||
      bdateTokenized.length > 3
    )
      throw TypeError(`malformed bdate string format: ${bdate}`);
    const birthDate = DATE_PARTS.reduce<object>(
      (dateObj, curDatePart, ind) => {
        return { ...dateObj, [curDatePart]: bdateTokenized[ind] };
      },
      {}
    ) as BirthDateParts;
    // console.log(birthDate);
    return birthDate;
  }
}
