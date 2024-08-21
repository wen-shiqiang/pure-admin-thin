import {
  getUserMsg,
  getMjrStandYear,
  getReviseNoticeByYear,
  getAllSchoolData,
  getDeptInfoByCondition,
  getMjrStandardByCond
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

  return {
    getUserMsgApi,
    getMjrStandYearApi,
    getReviseNoticeByYearApi,
    getAllSchoolDataApi,
    getDeptInfoByConditionApi,
    getMjrStandardByCondApi
  };
};
