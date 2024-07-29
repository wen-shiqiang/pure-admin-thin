import { defineStore } from "pinia";
import { store, storageSession } from "../utils";

export const useToken = defineStore({
  id: "mms-token",
  state: () => {
    return {
      token:
        storageSession().getItem("mms-token") ||
        storageSession().getItem("token")
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
      storageSession().setItem("token", token);
    }
  },
  persist: [
    {
      paths: ["token"],
      storage: sessionStorage
    }
  ]
});

export function useTokenStoreHook() {
  return useToken(store);
}
