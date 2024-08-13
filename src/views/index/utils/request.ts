import {
  getUserMsg,
  getMjrStandYear,
  getReviseNoticeByYear,
  getAllSchoolData
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
      debugKey: "getReviseNoticeByYear",
      manual: true
    }
  );

  return {
    getUserMsgApi,
    getMjrStandYearApi,
    getReviseNoticeByYearApi,
    getAllSchoolDataApi
  };
};