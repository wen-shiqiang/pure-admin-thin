import { defineStore } from "pinia";
import { store, storageSession, storageNameSpace } from "../utils";
const name = "token";
const storageName = `${storageNameSpace()}${name}`;
export const useToken = defineStore({
  id: storageName,
  state: () => {
    return {
      token:
        storageSession().getItem(storageName) || storageSession().getItem(name)
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
