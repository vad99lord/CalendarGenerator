import { Text, TextProps } from "@vkontakte/vkui";
import { BirthDate } from "../../network/models/Birthday/Birthday";

interface BirthdayProps extends Omit<TextProps, "children"> {
  birthDate?: BirthDate;
}

const EMPTY_BIRTHDAY_TEXT = "День рождения не указан(";

const getBirthdayText = (bdate?: BirthDate) => {
  if (!bdate) return EMPTY_BIRTHDAY_TEXT;
  const day = bdate.getDay();
  const month = bdate.getMonthName();
  let birthdayParts = [day, month];
  const year = bdate.getYear();
  if (year) {
    birthdayParts.push(year);
  }
  return birthdayParts.join(" ");
};

const Birthday = ({ birthDate,...props }: BirthdayProps) => {
  return <Text {...props}>{getBirthdayText(birthDate)}</Text>;
};

export default Birthday;
