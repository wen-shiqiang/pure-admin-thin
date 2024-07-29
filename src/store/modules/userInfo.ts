import { defineStore } from "pinia";
import { store, storageSession } from "../utils";

export const useUserInfo = defineStore({
  id: "mms-userInfo",
  state: () => {
    return {
      userInfo:
        storageSession().getItem("mms-userInfo") ||
        storageSession().getItem("userInfo")
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
      storageSession().setItem("userInfo", userInfo);
    }
  },
  persist: [
    {
      paths: ["userInfo"],
      storage: sessionStorage
    }
  ]
});

export function useUserInfoStoreHook() {
  return useUserInfo(store);
}
