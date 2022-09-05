import { Button, Div, Panel, Text } from "@vkontakte/vkui";

import { CalendarUserApi } from "@shared/models/CalendarUser";
import { observer } from "mobx-react-lite";
import useLocalStore from "../../hooks/useLocalStore";
import CalendarGeneratorStore from "./CalendarGeneratorStore";
import CheckedUsersStore from "../../stores/CheckedUsersStore/CheckedUsersStore";
import { mapValues } from "../../utils/utils";
import { NavElementId } from "../ChooseUsers/ChooseUsers";

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
