import {
  getUserMsg,
  getMjrStandYear,
  getReviseNoticeByYear,
  getAllSchoolData,
  getDeptInfoByCondition,
  getMjrStandardByCond,
  getCourCoursesByCond,
  getDeptCompleteRate,
  getSchoolReviseRate,
  getMjrStandardEfficiency
} from "@/api";
import { useRequest } from "vue-hooks-plus";
export const useApiRequests = () => {
  const { runAsync: getUserMsgApi } = useRequest(
    (params: any) => getUserMsg(params),
    {
      debugKey: "getUserMsg",
      manual: true
    }
  );
  const { runAsync: getMjrStandYearApi } = useRequest(() => getMjrStandYear(), {
    debugKey: "getMjrStandYear",
    manual: true
  });
  const { runAsync: getReviseNoticeByYearApi } = useRequest(
    (params: any) => getReviseNoticeByYear(params),
    {
      debugKey: "getReviseNoticeByYear",
      manual: true
    }
  );
  const { runAsync: getAllSchoolDataApi } = useRequest(
    (params: any) => getAllSchoolData(params),
    {
      debugKey: "getAllSchoolData",
      manual: true
    }
  );
  const { runAsync: getDeptInfoByConditionApi } = useRequest(
    (params: any) => getDeptInfoByCondition(params),
    {
      debugKey: "getDeptInfoByCondition",
      manual: true
    }
  );
  const { runAsync: getMjrStandardByCondApi } = useRequest(
    (params: any) => getMjrStandardByCond(params),
    {
      debugKey: "getMjrStandardByCond",
      manual: true
    }
  );
  const { runAsync: getCourCoursesByCondApi } = useRequest(
    (params: any) => getCourCoursesByCond(params),
    {
      debugKey: "getCourCoursesByCond",
      manual: true
    }
  );
  const { runAsync: getDeptCompleteRateApi } = useRequest(
    (params: any) => getDeptCompleteRate(params),
    {
      debugKey: "getDeptCompleteRate",
      manual: true
    }
  );
  const { runAsync: getSchoolReviseRateApi } = useRequest(
    (params: any) => getSchoolReviseRate(params),
    {
      debugKey: "getSchoolReviseRate",
      manual: true
    }
  );
  const { runAsync: getMjrStandardEfficiencyApi } = useRequest(
    (params: any) => getMjrStandardEfficiency(params),
    {
      debugKey: "getMjrStandardEfficiency",
      manual: true
    }
  );

  return {
    getUserMsgApi,
    getMjrStandYearApi,
    getReviseNoticeByYearApi,
    getAllSchoolDataApi,
    getDeptInfoByConditionApi,
    getMjrStandardByCondApi,
    getCourCoursesByCondApi,
    getDeptCompleteRateApi,
    getSchoolReviseRateApi,
    getMjrStandardEfficiencyApi
  };
};
