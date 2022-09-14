import {
  Button,
  Group,
  Panel,
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

export enum FetchState {
  INITIAL,
  LOADING,
  FINISHED,
  ERROR,
}

// const calendarGeneratorContent = (loadState: LoadState)

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
            </div>
          </Group>
        );
      }
    }
  }, [calendarStore, onNextClick]);

  return <Panel id={panelId}>{getContent()}</Panel>;
};

export default observer(CalendarGenerator);
