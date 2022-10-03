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
import serverless from "serverless-http";
import { createBirthdayCalendar } from "./generator/calendar-generator";
import { RequestTypedBody } from "./types/types";

const app = express();

const router = express.Router();

router.post(
  "/api/calendar",
  check("birthdays").isArray(),
  check("birthdays.*.name").isString().notEmpty(),
  check("birthdays.*.birthday").isISO8601({
    strict: true,
    strictSeparator: true,
  }),
  check("birthdays.*.id")
    .isString()
    .notEmpty()
    .optional({ nullable: true }),
  (req: RequestTypedBody<CalendarUserApiRequest>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    const currentYear = new Date().getUTCFullYear();
    const calendarUsers: CalendarUser[] = req.body.birthdays.map(
      ({ name, birthday, id }) => {
        const birthDate = new Date(birthday);
        const day = birthDate.getUTCDate();
        const month = birthDate.getUTCMonth();
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
          id: id,
        };
      }
    );
    const calendar = createBirthdayCalendar(calendarUsers);
    calendar.serve(res);
  }
);


app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
