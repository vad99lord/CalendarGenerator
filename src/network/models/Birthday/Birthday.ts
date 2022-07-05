import { Optional } from "../../../utils/types";

const DATE_PARTS = ["day", "month", "year"] as const;

type DateParts = Record<typeof DATE_PARTS[number], number>;

export type BirthDateParts = Optional<DateParts, "year">;

export class BirthDate {
  private readonly birthDate: Date;
  private birthDateParts: BirthDateParts;
  private static MONTH_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
    month: "long",
  });

  constructor(bdate: string) {
    this.birthDateParts = BirthDate.stringToBirthDateParts(bdate);
    const { year, month, day } = this.birthDateParts;
    this.birthDate = new Date(year ?? 0, month - 1, day);
    // console.log(this.getMonthDate());
    
  }

  public getDay(): number {
    return this.birthDate.getDate();
  }

  public getMonthName(): string {
    return BirthDate.MONTH_FORMATTER.format(this.birthDate);
  }

  public getMonthDate(): number {
    return this.birthDate.getMonth() + 1; // 0-based date in Date class
  }

  public getYear(): number | undefined {
    if (!this.birthDateParts.year) return undefined;
    return this.birthDate.getFullYear();
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
