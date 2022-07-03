import { Text } from "@vkontakte/vkui";
import { BirthDate } from "../network/models/Birthday/Birthday";

type BirthdayProps = {
  birthDate?: BirthDate;
};

const EMPTY_BIRTHDAY_TEXT = "День рождения не установлено(";

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

const Birthday = ({ birthDate }: BirthdayProps) => {
  return <Text>{getBirthdayText(birthDate)}</Text>;
};

export default Birthday;
