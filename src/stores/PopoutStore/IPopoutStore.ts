export type PopoutContent = React.ReactNode;

export default interface IPopoutStore {
  get popout(): PopoutContent;
  setPopout(newPopout: PopoutContent): void;
  closePopout(): void;
}
