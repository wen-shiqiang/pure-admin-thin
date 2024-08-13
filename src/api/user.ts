import { http } from "@/utils/http";
import type { UserResult, RefreshTokenResult } from "./types.d";
const { requstUrl } = window?.mms || { requstUrl: "" };

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/login", { data });
};
/** 获取UUID */
export const getUUID = (data?: object) => {
  return http.request<UserResult>("get", requstUrl + "/user/v1/getUUID", {
    data
  });
};

/** 获取验证码 */
export const generateCode = (params?: object) => {
  return http.request(
    "get",
    requstUrl + "/user/v1/generateCode",
    {
      params
    },
    {
      responseType: "blob"
    },
    {
      status: false
    }
  );
};
/** 获取学校信息 */
export const getSchoolInfo = (params?: object) => {
  return http.request<UserResult>("get", requstUrl + "/user/v1/getSchoolInfo", {
    params
  });
};
/** 登陆 */
export const login = (params?: object) => {
  return http.request<UserResult>("post", requstUrl + "user/v1/login", {
    params
  });
};
/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refresh-token", { data });
};
