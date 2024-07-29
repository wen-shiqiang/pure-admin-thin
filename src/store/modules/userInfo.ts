import { defineStore } from "pinia";
import { store, storageSession, storageNameSpace } from "../utils";
const name = "userInfo";
const storageName = `${storageNameSpace()}${name}`;
export const useUserInfo = defineStore({
  id: storageName,
  state: () => {
    return {
      userInfo:
        storageSession().getItem(storageName) || storageSession().getItem(name)
    };
  },
  getters: {
    getUserInfo: state => {
      return state.userInfo;
    }
  },
  actions: {
    setUserInfo(userInfo: object) {
      this.userInfo = userInfo;
      storageSession().setItem(name, userInfo);
    }
  },
  persist: [
    {
      paths: [name],
      storage: sessionStorage
    }
  ]
});

export function useUserInfoStoreHook() {
  return useUserInfo(store);
}
