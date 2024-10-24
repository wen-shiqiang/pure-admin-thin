import { defineStore } from "pinia";
import {
  store,
  storageSession,
  storageNameSpace,
  getItemFromStorage
} from "../utils";
const name = "token";
const storageName = `${storageNameSpace() || "mms-"}${name}`;
export const useToken = defineStore({
  id: storageName,
  state: () => {
    return {
      token: getItemFromStorage([[storageName, [name]], name])
    };
  },
  getters: {
    getToken: state => {
      return state.token;
    }
  },
  actions: {
    setToken(token: string): void {
      this.token = token;
      storageSession().setItem(name, token);
    }
  },
  persist: [
    {
      paths: [name],
      storage: sessionStorage
    }
  ]
});

export function useTokenStoreHook() {
  return useToken(store);
}
