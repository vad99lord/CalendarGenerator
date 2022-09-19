import { API_ENDPOINTS } from "@network/api/ApiConfig";
import { CalendarUserApi } from "@shared/models/CalendarUser";
import ICheckedUsersStore from "@stores/CheckedUsersStore/ICheckedUsersStore";
import AxiosFetchStore, {
  AxiosFetchStoreParams,
  IAxiosFetchStore,
} from "@stores/FetchStores/AxiosFetchStore/AxiosFetchStore";
import { Disposable } from "@utils/types";
import { mapValues } from "@utils/utils";
import saveAs from "file-saver";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
} from "mobx";

export default class CalendarGeneratorStore implements Disposable {
  private readonly _fetchStore: IAxiosFetchStore<"GenerateCalendar">;
  private static readonly CALENDAR_FILENAME = "birthdays";
  private readonly _saveCalendarReaction: IReactionDisposer;
  private readonly _checkedUsersStore: ICheckedUsersStore;
  private _shouldAddProfileLinks: boolean = false;

  constructor(checkedUsersStore: ICheckedUsersStore) {
    this._checkedUsersStore = checkedUsersStore;
    this._fetchStore = new AxiosFetchStore();
    makeObservable<
      CalendarGeneratorStore,
      "_fetch" | "_shouldAddProfileLinks" | "_calendarUsers"
    >(this, {
      fetch: action.bound,
      _fetch: action.bound,
      loadState: computed,
      _calendarUsers: computed,
      _shouldAddProfileLinks: observable,
      shouldAddProfileLinks: computed,
      toggleShouldAddProfileLinks: action.bound,
    });
    this._saveCalendarReaction = reaction(
      () => this._fetchStore.data,
      (blob) => {
        if (!blob) return;
        saveAs(blob, CalendarGeneratorStore.CALENDAR_FILENAME);
      }
    );
  }

  get shouldAddProfileLinks() {
    return this._shouldAddProfileLinks;
  }

  toggleShouldAddProfileLinks() {
    this._shouldAddProfileLinks = !this._shouldAddProfileLinks;
  }

  get error() {
    return this._fetchStore.error;
  }

  get loadState() {
    return this._fetchStore.loadState;
  }

  private _fetch(
    requestData: AxiosFetchStoreParams<"GenerateCalendar">["data"]
  ) {
    const url = API_ENDPOINTS.GenerateCalendar();
    this._fetchStore.fetch({
      apiEndpoint: url,
      method: "POST",
      data: requestData,
      config: {
        responseType: "blob",
      },
    });
  }

  fetch() {
    this._fetch({ birthdays: this._calendarUsers });
  }

  private get _calendarUsers(): CalendarUserApi[] {
    return mapValues(this._checkedUsersStore.checked, (user) => {
      if (!user.birthday)
        throw Error(
          `undefined date for ${user} during calendar generation!`
        );
      return {
        name: `${user.firstName} ${user.lastName}`,
        birthday: user.birthday.toDate().toJSON(),
        id: this._shouldAddProfileLinks ? `${user.id}` : null,
      };
    });
  }

  destroy() {
    this._saveCalendarReaction();
    this._fetchStore.destroy();
  }
}
