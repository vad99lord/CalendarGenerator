import { TooltipTourContext } from "@contexts/TooltipTourContext";
import { useLateInitContext } from "@hooks/useLateInitContext";
import useLocalStore from "@hooks/useLocalStore";
import { BirthdaysCalendarViews } from "@routes/types/navigation/views";
import CheckedUsersStore from "@stores/CheckedUsersStore/CheckedUsersStore";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import { INonEmptyNavigationStackStore } from "@stores/NavigationStackStore/INavigationStackStore";
import { NonEmptyNavStackStore } from "@stores/NavigationStackStore/NavigationStackStore";
import IOnboardingStore from "@stores/OnboardingStore/IOnboardingStore";
import OnboardingStore from "@stores/OnboardingStore/OnboardingStore";
import { Root, SplitCol } from "@vkontakte/vkui";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import {
  BirthdaysCalendarRootNavigation,
  INITIAL_NAV_STATE,
} from "../types/navigation/root";
import CalendarGenerator from "../views/CalendarGenerator/CalendarGenerator";
import UsersPicker from "../views/UsersPicker/UsersPicker";

const BirthdaysCalendar = () => {
  const checkedUsersStore: ICheckedUsersStore =
    useLocalStore(CheckedUsersStore);
  const tooltipTourStore = useLateInitContext(TooltipTourContext);
  const onboardingStore: IOnboardingStore = useLocalStore(
    OnboardingStore,
    tooltipTourStore
  );
  const navStackStore: INonEmptyNavigationStackStore<BirthdaysCalendarRootNavigation> =
    useLocalStore(
      NonEmptyNavStackStore<BirthdaysCalendarRootNavigation>,
      INITIAL_NAV_STATE
    );
  const activeView = computed(
    () => navStackStore.currentEntry.activeView
  ).get();
  useEffect(() => {
    onboardingStore.startTooltipTour();
  }, [onboardingStore]);
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
