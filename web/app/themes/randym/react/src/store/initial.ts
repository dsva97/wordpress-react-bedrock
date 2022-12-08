import { IStore } from ".";

let initialStore: IStore = { name: "default Value" };

if (globalThis.window) {
  const customWindow = window as unknown as Window & {
    __INITIAL_STATE__: IStore;
  };
  if (customWindow.__INITIAL_STATE__) {
    initialStore = customWindow.__INITIAL_STATE__;
  }
} else {
  const { argv } = require("process");

  const [_, __, _urlPath = "/", _typeComponent = "App", base64State] = argv;

  try {
    const stateDecoded = Buffer.from(base64State, "base64").toString("utf8");
    initialStore = JSON.parse(stateDecoded);
  } catch (_) {}
}

export { initialStore };
