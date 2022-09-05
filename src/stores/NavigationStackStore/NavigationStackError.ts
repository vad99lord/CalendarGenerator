export default class NavigationStackError extends Error {
  name = "NavigationStackError";

  constructor(message: string) {
    super(`Navigation stack error: ${message}`);

    //extending a built-in class
    Object.setPrototypeOf(this, NavigationStackError.prototype);
  }
}
