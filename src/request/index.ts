import { getDateCategoryByPage } from "@/api/index";
import { useRequest } from "vue-hooks-plus";
export const useRequests = () => {
  const { runAsync: getDateCategoryByPageApi } = useRequest(
    () => getDateCategoryByPage(),
    {
      debugKey: "getDateCategoryByPage",
      manual: true
    }
  );

  return {
    getDateCategoryByPageApi
  };
};
