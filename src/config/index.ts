import axios from "axios";
import type { App } from "vue";
import { storageSession, storageLocal, isString } from "@pureadmin/utils";
let config: object = {};
const { VITE_PUBLIC_PATH } = import.meta.env;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach(v => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({
    method: "get",
    url: `${VITE_PUBLIC_PATH}platform-config.json`
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // 自动注入系统配置
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // 设置全局配置
        setConfig($config);
      }
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加platform-config.json配置文件";
    });
};
/**
 * @description: 获取本地存储的值
 * @param {string} keys 键值
 * @param {*} type 0: sessionStorage 1: localStorage
 * @return {*}
 */
type KeyType = string | [string, string] | Array<string | [string, string]>;
const getItemFromStorage = (keys: KeyType, type: number = 0) => {
  const storage = type ? storageLocal() : storageSession();
  try {
    if (isString(keys)) {
      return storage.getItem(keys);
    }
    for (const key of keys) {
      let value = null;
      if (isString(key)) {
        value = storage.getItem(key);
      } else if (Array.isArray(key) && key.length === 2 && isString(key[0])) {
        const item = storage.getItem(key[0]);
        if (item) {
          value = item[key[1]];
        }
      }
      if (value) {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error("getItemFromStorage error", error);
    return null;
  }
};

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;
const storageNameSpace = () => getConfig().StorageNameSpace;

export {
  getConfig,
  setConfig,
  getItemFromStorage,
  responsiveStorageNameSpace,
  storageNameSpace
};
