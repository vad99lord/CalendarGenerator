import {
  CalendarUser,
  CalendarUserApiRequest,
} from "@shared/models/CalendarUser";
import {
  createUTCDate,
  isLeapYearLastFebruary,
} from "@shared/utils/utils";
import express, { Response } from "express";
import { check, validationResult } from "express-validator";
import { createBirthdayCalendar } from "./calendar-generator";
import { RequestTypedBody } from "./types";

const app = express();
const port = 3000;

app.use(express.json());

app.post(
  "/api/calendar",
  check("birthdays.*.name").notEmpty(),
  check("birthdays.*.birthday").isISO8601({
    strict: true,
    strictSeparator: true,
  }),
  (req: RequestTypedBody<CalendarUserApiRequest>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const currentYear = new Date().getUTCFullYear();
    console.log(req.body.birthdays);
    const calendarUsers: CalendarUser[] = req.body.birthdays.map(
      ({ name, birthday }) => {
        const birthDate = new Date(birthday);
        const day = birthDate.getUTCDate();
        const month = birthDate.getUTCMonth();
        console.log({ currentYear, day, month });
        //make 29 february -> 28 for cross-years consistency
        const fixedLeapYearDay = isLeapYearLastFebruary(month, day)
          ? day - 1
          : day;
        return {
          name,
          birthday: createUTCDate(
            currentYear,
            month,
            fixedLeapYearDay
          ),
        };
      }
    );
    const calendar = createBirthdayCalendar(calendarUsers);
    calendar.serve(res);
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
