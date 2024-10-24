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
/** 获取我的课标 */
export const getCourCoursesByCond = (data?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getCourCoursesByCond",
    {
      data
    }
  );
};
/** 获取学院完成情况 */
export const getDeptCompleteRate = (params?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getDeptCompleteRate",
    {
      params
    }
  );
};
/** 获取全校修订进度 */
export const getSchoolReviseRate = (params?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getSchoolReviseRate",
    {
      params
    }
  );
};
/** 获取培养方案修订效率 */
export const getMjrStandardEfficiency = (params?: object) => {
  return http.post<UserResult, UserParams>(
    requstUrl + "/homePage/v1/getMjrStandardEfficiency",
    {
      params
    }
  );
};
