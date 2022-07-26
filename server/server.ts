import express, { Response } from "express";
import { check, validationResult } from "express-validator";
import {
  CalendarUser,
  CalendarUserApiRequest,
  createBirthdayCalendar,
} from "./calendar-generator";
import { RequestTypedBody } from "./types";

const app = express();
const port = 3000;

app.use(express.json());

app.post(
  "/api/calendar",
  check("birthdays.*.name").notEmpty(),
  check("birthdays.*.birthday")
    .isISO8601({ strict: true, strictSeparator: true }),
  (req: RequestTypedBody<CalendarUserApiRequest>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const calendarUsers: CalendarUser[] = req.body.birthdays.map(
      ({ name, birthday }) => ({
        name,
        birthday: new Date(birthday),
      })
    );
    const calendar = createBirthdayCalendar(calendarUsers);
    calendar.serve(res);
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
