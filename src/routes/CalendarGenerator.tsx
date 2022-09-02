import { Button, Div, Panel, Text } from "@vkontakte/vkui";
import { useCallback, useState } from "react";

import { CalendarUserApi } from "@shared/models/CalendarUser";
import saveAs from "file-saver";
import { observer } from "mobx-react-lite";
import { API_ENDPOINTS } from "../network/api/ApiConfig";
import fetchAxios from "../network/api/fetchAxios";
import CheckedUsersStore from "../stores/CheckedUsersStore";
import { NavElementId } from "./ChooseUsers";

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
    const url = API_ENDPOINTS.GenerateCalendar();
    const { isError, data: blob } =
      await fetchAxios<"GenerateCalendar">(
        url,
        "POST",
        {
          birthdays: calendarUsers,
        },
        { 
          responseType: "blob",
        }
      );
    if (!isError) {
      setGenState(FetchState.FINISHED);
      saveAs(blob, "birthdays");
    } else {
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
