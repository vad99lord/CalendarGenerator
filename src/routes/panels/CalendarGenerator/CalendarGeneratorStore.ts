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
  reaction,
} from "mobx";

export default class CalendarGeneratorStore implements Disposable {
  private readonly _fetchStore: IAxiosFetchStore<"GenerateCalendar">;
  private static readonly CALENDAR_FILENAME = "birthdays";
  private readonly _saveCalendarReaction: IReactionDisposer;
  private readonly _checkedUsersStore: ICheckedUsersStore;

  constructor(checkedUsersStore: ICheckedUsersStore) {
    this._checkedUsersStore = checkedUsersStore;
    this._fetchStore = new AxiosFetchStore();
    makeObservable<CalendarGeneratorStore, "_fetch">(this, {
      fetch: action.bound,
      _fetch: action.bound,
      loadState: computed,
      calendarUsers: computed,
    });
    this._saveCalendarReaction = reaction(
      () => this._fetchStore.data,
      (blob) => {
        if (!blob) return;
        saveAs(blob, CalendarGeneratorStore.CALENDAR_FILENAME);
      }
    );
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
    this._fetch({ birthdays: this.calendarUsers });
  }

  get calendarUsers(): CalendarUserApi[] {
    return mapValues(this._checkedUsersStore.checked, (user) => ({
      name: `${user.firstName} ${user.lastName}`,
      //TODO birthday should be non-nullable here already
      birthday: user.birthday?.toDate().toJSON() ?? "",
    }));
  }

  destroy() {
    this._saveCalendarReaction();
    this._fetchStore.destroy();
  }
}
