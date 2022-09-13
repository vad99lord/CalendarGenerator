import { Button, Div, Panel, Text } from "@vkontakte/vkui";

import useLocalStore from "@hooks/useLocalStore";
import { CalendarUserApi } from "@shared/models/CalendarUser";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { mapValues } from "@utils/utils";
import { observer } from "mobx-react-lite";
import CalendarGeneratorStore from "./CalendarGeneratorStore";
import { NavElementId } from "../types";

interface CalendarGeneratorProps extends NavElementId {
  checkedUsersStore: ICheckedUsersStore;
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
  const calendarStore = useLocalStore(CalendarGeneratorStore);

  const calendarUsers: CalendarUserApi[] = mapValues(
    checkedUsersStore.checked,
    (user) => ({
      name: `${user.firstName} ${user.lastName}`,
      //TODO birthday should be non-nullable here already
      birthday: user.birthday?.toDate().toJSON() ?? "",
    })
  );

  const onGenerate = () => {
    calendarStore.fetch({ birthdays: calendarUsers });
  };

  return (
    <Panel id={panelId}>
      <Div>
        <Button onClick={onGenerate}>Gen cal</Button>
        <Text>{calendarStore.loadState}</Text>
      </Div>
    </Panel>
  );
};

export default observer(CalendarGenerator);
