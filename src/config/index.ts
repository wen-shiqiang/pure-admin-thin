import axios from "axios";
import type { App } from "vue";
import {
  storageSession,
  storageLocal,
  isString,
  isArray
} from "@pureadmin/utils";
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
 * @param {string} keys 键值 ['key1', 'key2'] 或者
 *                           [['key1', 'key2'], 'key3']  或者
 *                           [['key1', ['key2', ['key3']]], 'key4']
 * @param {*} type 0: sessionStorage 1: localStorage
 * @return {*}
 */
const getItemFromStorage = (keys: any, type: number = 0): any => {
  const storage = type ? storageLocal() : storageSession();
  /**
   * @description: 获取嵌套对象的值
   * @param {any} item 对象
   * @param {string} keyArray 键值数组
   * @return {*} 值
   */
  const getNestedItem = (item: any, keyArray: any): any => {
    if (!item || keyArray.length === 0) {
      return item;
    }
    const [firstKey, ...restKeys] = keyArray;
    if (isArray(firstKey)) {
      return getNestedItem(
        item[firstKey[0]],
        firstKey.slice(1).concat(restKeys)
      );
    }
    return getNestedItem(item[firstKey], restKeys);
  };

  try {
    if (isString(keys)) {
      return storage.getItem(keys);
    }
    for (const key of keys) {
      let value = null;
      if (isString(key)) {
        value = storage.getItem(key);
      } else if (isArray(key) && key.length) {
        const item = storage.getItem(key[0]);
        if (item) {
          value = getNestedItem(item, key.slice(1));
        }
      }
      if (value) {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.log("error", error);
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
