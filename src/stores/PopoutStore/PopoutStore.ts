import { Disposable } from "@utils/types";
import { action, computed, makeObservable, observable } from "mobx";
import IPopoutStore, { PopoutContent } from "./IPopoutStore";

export default class PopoutStore implements IPopoutStore, Disposable {
  private _popout: PopoutContent;

  constructor() {
    this._popout = null;
    makeObservable<PopoutStore, "_popout">(this, {
      _popout: observable,
      popout: computed,
      setPopout: action.bound,
      closePopout: action.bound,
    });
  }

  get popout(): PopoutContent {
    return this._popout;
  }

  setPopout(newPopout: PopoutContent) {
    this._popout = newPopout;
  }

  closePopout() {
    this.setPopout(null);
  }

  destroy() {}
}
