import createStore from "zustand";
import { initialStore } from "./initial";

export interface IStore {
  name: string;
}

export const useStore = createStore<IStore>((set, get) => ({
  ...(initialStore as IStore),
}));
