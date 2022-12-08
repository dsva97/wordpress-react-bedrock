import { IStore } from "./store";

const { argv } = require("process");

const [_, __, urlPath = "/", typeComponent = "App", base64State] = argv;
let initialState: IStore | null = null;

try {
  const stateDecoded = Buffer.from(base64State, "base64").toString("utf8");
  initialState = JSON.parse(stateDecoded);
} catch (_) {}

export { urlPath, typeComponent, initialState };
