import {
  Button,
  Checkbox,
  Group,
  Headline,
  Panel,
  PanelHeader,
  Spinner,
  Title,
} from "@vkontakte/vkui";

import useLocalStore from "@hooks/useLocalStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { LoadState } from "@stores/LoadState";
import { Icon56CalendarOutline } from "@vkontakte/icons";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { NavElementId } from "../../types/navProps";
import CalendarGeneratorStore from "./CalendarGeneratorStore";

interface CalendarGeneratorProps extends NavElementId {
  checkedUsersStore: ICheckedUsersStore;
  onNextClick: () => void;
}

const CalendarGenerator = ({
  checkedUsersStore,
  onNextClick,
  nav: panelId,
}: CalendarGeneratorProps) => {
  const calendarStore = useLocalStore(
    CalendarGeneratorStore,
    checkedUsersStore
  );

  const getContent = useCallback(() => {
    switch (calendarStore.loadState) {
      case LoadState.Loading: {
        return <Spinner size="large" />;
      }
      case LoadState.Success: {
        return (
          <Group>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Title level="3">Календарь создан</Title>
              <Button onClick={onNextClick}>
                Создать еще один календарь
              </Button>
            </div>
          </Group>
        );
      }
      case LoadState.Error: {
        return (
          <Group>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Title level="3">Произошла ошибка(</Title>
              <Headline level="2">{calendarStore.error}</Headline>
              <Button onClick={calendarStore.fetch}>
                Попробовать еще раз
              </Button>
            </div>
          </Group>
        );
      }
      default: {
        return (
          <Group>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Icon56CalendarOutline />
              <Button onClick={calendarStore.fetch}>
                Создать календарь
              </Button>
              <Checkbox
                checked={calendarStore.shouldAddProfileLinks}
                onChange={calendarStore.toggleShouldAddProfileLinks}
              >
                Добавить ссылки на профили
              </Checkbox>
            </div>
          </Group>
        );
      }
    }
  }, [calendarStore, onNextClick]);

  return (
    <Panel id={panelId}>
      <PanelHeader separator={true}>Создание календаря</PanelHeader>
      {getContent()}
    </Panel>
  );
};

export default observer(CalendarGenerator);
