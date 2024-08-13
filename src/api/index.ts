import { http } from "@/utils/http";
import type { UserResult, UserParams } from "./types.d";
const { requstUrl } = window?.mms || { requstUrl: "" };
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

/** 获取用户未读的修订通知 */
export const getUserMsg = (params?: object) => {
  return http.get<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getUserMsg",
    {
      params
    }
  );
};
/** 获取版本年份 */
export const getMjrStandYear = (params?: object) => {
  return http.get<UserResult, UserParams>(
    requstUrl + "/majorManage/v1/getMjrStandYear",
    {
      params
    }
  );
};
/** 获取当前年份培养方案修订 */
export const getReviseNoticeByYear = (params?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getReviseNoticeByYear",
    {
      params
    }
  );
};
/** 获取当前年份培养方案修订 */
export const getAllSchoolData = (params?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getAllSchoolData",
    {
      params
    }
  );
};
/** 获取院系数据分析 */
export const getDeptInfoByCondition = (data?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getDeptInfoByCondition",
    {
      data
    }
  );
};
/** 获取我的专业 */
export const getMjrStandardByCond = (data?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getMjrStandardByCond",
    {
      data
    }
  );
};
