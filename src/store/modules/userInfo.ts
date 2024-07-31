import { defineStore } from "pinia";
import { store, storageNameSpace, getItemFromStorage } from "../utils";
const name = "userInfo";
const storageName = `${storageNameSpace()}${name}`;
export const useUserInfo = defineStore({
  id: storageName,
  state: () => {
    return {
      userInfo: getItemFromStorage([[storageName, name], name])
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
