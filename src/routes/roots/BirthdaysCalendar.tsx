import useLocalStore from "@hooks/useLocalStore";
import { BirthdaysCalendarViews } from "@routes/types/navigation/views";
import CheckedUsersStore from "@stores/CheckedUsersStore/CheckedUsersStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { NonEmptyNavStackStore } from "@stores/NavigationStackStore/NavigationStackStore";
import { Root, SplitCol } from "@vkontakte/vkui";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import {
  BirthdaysCalendarRootNavigation,
  INITIAL_NAV_STATE,
} from "../types/navigation/root";
import CalendarGenerator from "../views/CalendarGenerator/CalendarGenerator";
import UsersPicker from "../views/UsersPicker/UsersPicker";

const BirthdaysCalendar = () => {
  console.log("BirthdaysCalendar RENDER");
  const checkedUsersStore: ICheckedUsersStore =
    useLocalStore(CheckedUsersStore);
  const navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation> =
    useLocalStore(
      NonEmptyNavStackStore<BirthdaysCalendarRootNavigation>,
      INITIAL_NAV_STATE
    );
  const {
    currentEntry: { activeView },
  } = navStackStore;
  console.log({ navState: toJS(navStackStore.currentEntry) });
  return (
    <SplitCol>
      <Root activeView={activeView}>
        <UsersPicker
          nav={BirthdaysCalendarViews.UsersPicker}
          checkedUsersStore={checkedUsersStore}
          navStackStore={navStackStore}
        />
        <CalendarGenerator
          nav={BirthdaysCalendarViews.CalendarGenerator}
          checkedUsersStore={checkedUsersStore}
          navStackStore={navStackStore}
        />
      </Root>
    </SplitCol>
  );
};

export default observer(BirthdaysCalendar);
