import { Button, Div, Panel, Text } from "@vkontakte/vkui";
import saveAs from "file-saver";
import { useCallback, useState } from "react";

import { CalendarUserApi } from "@shared/models/CalendarUser";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import { NavElementId } from "./ChooseUsers";
import { observer } from "mobx-react-lite";

interface CalendarGeneratorProps extends NavElementId {
  checkedUsersStore: CheckedUsersStore;
}

export enum FetchState {
  INITIAL,
  LOADING,
  FINISHED,
  ERROR,
}

const CalendarGenerator = ({
  checkedUsersStore,
  nav: panelId,
}: CalendarGeneratorProps) => {
  const [genState, setGenState] = useState<FetchState>(
    FetchState.INITIAL
  );

  const users = Array.from(checkedUsersStore.checked.values());

  const calendarUsers: CalendarUserApi[] = users.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    birthday: user.birthday?.toDate().toJSON() ?? "",
  }));

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

export default observer(CalendarGenerator);
