import { Button, Div, Panel, Text } from "@vkontakte/vkui";
import saveAs from "file-saver";
import { useCallback, useMemo, useState } from "react";
import { UserModel } from "../network/models/User/UserModel";

import { CalendarUserApi } from "@shared/models/CalendarUser";
import { NavElementId } from "./ChooseUsers";

interface CalendarGeneratorProps extends NavElementId {
  users: UserModel[];
}

export enum FetchState {
  INITIAL,
  LOADING,
  FINISHED,
  ERROR,
}

const CalendarGenerator = ({
  users,
  nav: panelId,
}: CalendarGeneratorProps) => {
  const calendarUsers: CalendarUserApi[] = useMemo(
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
    <Panel id={panelId}>
      <Div>
        <Button onClick={onGenerate}>Gen cal</Button>
        <Text>{genState}</Text>
      </Div>
    </Panel>
  );
};

export default CalendarGenerator;
