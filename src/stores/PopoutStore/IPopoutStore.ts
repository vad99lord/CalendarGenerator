import { Disposable } from "@utils/types";

export type PopoutContent = React.ReactNode;

//TODO remove disposable from store interfaces
export default interface IPopoutStore extends Disposable {
  get popout(): PopoutContent;
  setPopout(newPopout: PopoutContent): void;
  closePopout(): void;
}
