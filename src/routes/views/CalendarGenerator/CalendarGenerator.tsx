import useLocalStore from "@hooks/useLocalStore";
import CalendarGeneratorPanel from "@routes/panels/CalendarGenerator/CalendarGenerator";
import { BirthdaysCalendarPanels } from "@routes/types/navigation/panels";
import { BirthdaysCalendarRootNavigation } from "@routes/types/navigation/root";
import { NavElementId } from "@routes/types/navProps";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { View } from "@vkontakte/vkui";
import { observer } from "mobx-react-lite";
import CalendarGeneratorStore from "./CalendarGeneratorStore";

interface CalendarGeneratorProps extends NavElementId {
  checkedUsersStore: ICheckedUsersStore;
  navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation>;
}

const CalendarGenerator = ({
  checkedUsersStore,
  navStackStore,
}: CalendarGeneratorProps) => {
  console.log("CalendarGenerator RENDER");
  const {
    currentEntry: {
      viewsState: { calendar_generator: calendarGeneratorPanels },
    },
  } = navStackStore;
  const calendarGeneratorStore = useLocalStore(
    CalendarGeneratorStore,
    checkedUsersStore,
    navStackStore
  );
  return (
    <View activePanel={calendarGeneratorPanels.activePanel}>
      <CalendarGeneratorPanel
        nav={BirthdaysCalendarPanels.GenerateCalendar}
        checkedUsersStore={checkedUsersStore}
      />
    </View>
  );
};

export default observer(CalendarGenerator);
