import saveAs from "file-saver";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  reaction,
} from "mobx";
import { API_ENDPOINTS } from "../network/api/ApiConfig";
import { Disposable } from "../utils/types";
import AxiosFetchStore, {
  AxiosFetchStoreParams,
} from "./AxiosFetchStore";

export default class CalendarGeneratorStore implements Disposable {
  private _fetchStore: AxiosFetchStore<"GenerateCalendar">;
  private static CALENDAR_FILENAME = "birthdays";
  private _saveCalendarReaction: IReactionDisposer;

  constructor() {
    this._fetchStore = new AxiosFetchStore();
    makeObservable(this, {
      fetch: action.bound,
      calendarBlob: computed,
      loadState: computed,
    });
    this._saveCalendarReaction = reaction(
      () => this.calendarBlob,
      (blob) => {
        if (!blob) return;
        saveAs(blob, CalendarGeneratorStore.CALENDAR_FILENAME);
      }
    );
  }

  get calendarBlob() {
    const response = this._fetchStore.response;
    if (!response || response.isError) return undefined;
    return response.data;
  }

  get loadState() {
    return this._fetchStore.loadState;
  }

  fetch(
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

  destroy() {
    this._saveCalendarReaction();
    this._fetchStore.destroy();
  }
}
