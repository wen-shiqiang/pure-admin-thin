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
/** 获取别名 */
export const getDateCategoryByPage = (params?: object) => {
  return http.request<UserResult>(
    "post",
    requstUrl + "/courseCategory/v1/getDateCategoryByPage",
    {
      params
    }
  );
};