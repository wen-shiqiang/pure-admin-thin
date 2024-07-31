import { defineStore } from "pinia";
import { store, storageNameSpace } from "../utils";
import { useRequests } from "@/request/index";
const name = "categoryByPage";
const storageName = `${storageNameSpace()}${name}`;
export const useCategoryByPage = defineStore({
  id: storageName,
  state: () => {
    return {
      courseCategory: "课程类别", // type0课程类别
      courseAttribute: "课程属性", // type1课程属性
      courseNature: "课程性质", // type2课程性质
      courseMold: "课程类型", // type3课程类型
      courseType: "考核方式" // type5考核方式
    };
  },
  getters: {
    getCourseCategory: state => {
      return state.courseCategory;
    },
    getCourseAttribute: state => {
      return state.courseAttribute;
    },
    getCourseNature: state => {
      return state.courseNature;
    },
    getCourseMold: state => {
      return state.courseMold;
    },
    getCourseType: state => {
      return state.courseType;
    }
  },
  actions: {
    setAnotherName(data) {
      const typeMapping = {
        0: "courseCategory",
        1: "courseAttribute",
        2: "courseNature",
        3: "courseMold",
        5: "courseType"
      };

      data.forEach(item => {
        const key = typeMapping[item.type];
        if (key) {
          this[key] = item.alias;
        }
      });
    },
    getDateCategoryByPage() {
      const { getDateCategoryByPageApi } = useRequests();
      const getCategoryByPage = async () => {
        try {
          const data = await getDateCategoryByPageApi();
          console.log("getDateCategoryByPageApi", data);
          // return (await getDateCategoryByPageApi()).result;
        } catch (error) {
          console.error("getDateCategoryByPageApi error", error);
          return null;
        }
      };
      getCategoryByPage();
    }
  },
  persist: [
    {
      paths: [name],
      storage: sessionStorage
    }
  ]
});

export function useCategoryByPageStoreHook() {
  return useCategoryByPage(store);
}
