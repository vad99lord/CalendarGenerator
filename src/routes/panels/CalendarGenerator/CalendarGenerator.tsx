import { Button, Group, Panel, Spinner } from "@vkontakte/vkui";

import useLocalStore from "@hooks/useLocalStore";
import { CalendarUserApi } from "@shared/models/CalendarUser";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { LoadState } from "@stores/LoadState";
import { mapValues } from "@utils/utils";
import { Icon56CalendarOutline } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { NavElementId } from "../../types/navProps";
import CalendarGeneratorStore from "./CalendarGeneratorStore";

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
      {calendarStore.loadState === LoadState.Loading ? (
        <Spinner size="large" />
      ) : (
        <Group>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Icon56CalendarOutline />
            <Button onClick={onGenerate}>Создать календарь</Button>
          </div>
        </Group>
      )}
    </Panel>
  );
};

export default observer(CalendarGenerator);
