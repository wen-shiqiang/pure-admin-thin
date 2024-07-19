import { http } from "@/utils/http";
const { requstUrl } = window?.mms || { requstUrl: "" };
export type UserResult = {
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
  result?: any;
  message?: string;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

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
