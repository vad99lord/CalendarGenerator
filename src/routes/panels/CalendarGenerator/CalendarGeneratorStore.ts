import { API_ENDPOINTS } from "@network/api/ApiConfig";
import AxiosFetchStore, {
  AxiosFetchStoreParams,
  IAxiosFetchStore,
} from "@stores/FetchStores/AxiosFetchStore/AxiosFetchStore";
import { Disposable } from "@utils/types";
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

  constructor() {
    this._fetchStore = new AxiosFetchStore();
    makeObservable(this, {
      fetch: action.bound,
      loadState: computed,
    });
    this._saveCalendarReaction = reaction(
      () => this._fetchStore.data,
      (blob) => {
        if (!blob) return;
        saveAs(blob, CalendarGeneratorStore.CALENDAR_FILENAME);
      }
    );
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
