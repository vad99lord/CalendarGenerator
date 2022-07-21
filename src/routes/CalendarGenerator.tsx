import { BirthDate } from "../network/models/Birthday/Birthday";
import { UserModel } from "../network/models/User/UserModel";

type CalendarGeneratorProps = {
  users: UserModel[];
};

export type CalendarUser = {
  firstName: string;
  lastName: string;
  birthday: BirthDate;
};

const CalendarGenerator = ({ users }: CalendarGeneratorProps) => {};

export default CalendarGenerator;
