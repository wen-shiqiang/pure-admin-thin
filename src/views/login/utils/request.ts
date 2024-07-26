import { getUUID, generateCode, getSchoolInfo, login } from "@/api/user";
import { useRequest } from "vue-hooks-plus";
export const useApiRequests = () => {
  const { runAsync: getUUIDApi } = useRequest(() => getUUID(), {
    debugKey: "getUUID",
    manual: true
  });

  const { runAsync: getSchoolInfoApi } = useRequest(
    (params: any) => getSchoolInfo(params),
    {
      debugKey: "getSchoolInfo",
      manual: true
    }
  );

  const { runAsync: generateCodeApi } = useRequest(
    (params: any) => generateCode(params),
    {
      debugKey: "generateCode",
      manual: true
    }
  );
  const { runAsync: loginApi } = useRequest((params: any) => login(params), {
    debugKey: "login",
    manual: true
  });

  return {
    getUUIDApi,
    getSchoolInfoApi,
    generateCodeApi,
    loginApi
  };
};
