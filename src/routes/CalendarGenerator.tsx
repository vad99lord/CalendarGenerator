import { Button, Div, Panel, Text } from "@vkontakte/vkui";
import saveAs from "file-saver";
import { useCallback, useMemo, useState } from "react";
import { UserModel } from "../network/models/User/UserModel";

type CalendarGeneratorProps = {
  users: UserModel[];
  id: string;
};

export type CalendarUser = {
  name: string;
  birthday: string;
};

export enum FetchState {
  INITIAL,
  LOADING,
  FINISHED,
  ERROR,
}

const CalendarGenerator = ({ users, id }: CalendarGeneratorProps) => {
  const calendarUsers: CalendarUser[] = useMemo(
    () =>
      users.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        birthday: user.birthday?.toDate().toJSON() ?? "",
      })),
    [users]
  );
  const [genState, setGenState] = useState<FetchState>(
    FetchState.INITIAL
  );

  const onGenerate = useCallback(async () => {
    setGenState(FetchState.LOADING);
    try {
      const response = await fetch("api/calendar", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ birthdays: calendarUsers }),
      });
      if (!response.ok) {
        console.log(response.body);
        throw Error();
      }
      const blob = await response.blob();
      saveAs(blob, "birthdays");
      setGenState(FetchState.FINISHED);
    } catch (err) {
      setGenState(FetchState.ERROR);
    }
  }, [calendarUsers]);

  return (
    <Panel id={id}>
      <Div>
        <Button onClick={onGenerate}>Gen cal</Button>
        <Text>{genState}</Text>
      </Div>
    </Panel>
  );
};

export default CalendarGenerator;
