import { Button, Div, Panel, Text } from "@vkontakte/vkui";
import saveAs from "file-saver";
import { useCallback, useState } from "react";

import {
  CalendarUserApi,
  CalendarUserApiRequest,
} from "@shared/models/CalendarUser";
import axios, { AxiosResponse } from "axios";
import { observer } from "mobx-react-lite";
import { isDevEnv } from "../../shared/src/utils/utils";
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
    try {
      const response = await axios.post<
        Blob,
        AxiosResponse<Blob>,
        CalendarUserApiRequest
      >(
        "api/calendar",
        {
          birthdays: calendarUsers,
        },
        {
          responseType: "blob",
        }
      );
      const blob = response.data;
      setGenState(FetchState.FINISHED);
      saveAs(blob, "birthdays");
    } catch (err) {
      setGenState(FetchState.ERROR);
      if (axios.isAxiosError(err)) {
        const reqUrl = err.config.url;
        console.log(`${reqUrl ? reqUrl + ": " : ""}${err.message}`);
        if (isDevEnv()) {
          const isBlob = (data: unknown): data is Blob =>
            data instanceof Blob;
          const responseData = isBlob(err.response?.data)
            ? await err.response?.data?.text()
            : err.response?.data || {};
          console.log("request:\n", err?.response?.request);
          console.log("response data:\n", responseData);
          console.log("response headers:\n", err?.response?.headers);
        }
      } else {
        if (isDevEnv()) {
          console.log("Unknown error occurred during fetch", err);
        } else {
          console.log("Unknown error occurred during fetch");
        }
      }
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
