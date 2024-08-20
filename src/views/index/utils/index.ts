import { ref, watch, h, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useApiRequests } from "./request";
import { isAllEmpty } from "@pureadmin/utils";
import { ElNotification, ElButton } from "element-plus";
import { useSetState } from "vue-hooks-plus";
import type { Title, YearParams } from "./types";
import dayjs from "dayjs";
export const year = ref(dayjs().year());

export const indexRun = () => {
  const { getUserMsgApi, getMjrStandYearApi, getReviseNoticeByYearApi } =
    useApiRequests();
  const router = useRouter();
  const [noticeInfo, setNoticeInfo] = useSetState<any>({});
  const [years, setYears] = useSetState<Array<number>>([]);
  const statusMap = {
    0: { tag: "warning", text: "未开始" },
    1: { tag: "primary", text: "进行中" },
    2: { tag: "info", text: "已结束" }
  };
  const [revise, setRevise] = useSetState<any>({
    showTagFun: (status: number) => statusMap[status]?.tag || statusMap[0]?.tag,
    showTagTextFun: (status: number) =>
      statusMap[status]?.text || statusMap[0]?.text
  });
  const getReviseNoticeByYear = async (params: YearParams) => {
    try {
      const { result } = (await getReviseNoticeByYearApi(params)) || {};
      setRevise({ ...revise.value, ...result });
    } catch (error) {
      console.error("getReviseNoticeByYear error", error);
    }
  };
  getReviseNoticeByYear({ year: year.value });
  const getMjrStandYear = async () => {
    try {
      const { result } = await getMjrStandYearApi();
      setYears(result || []);
    } catch (error) {
      console.error("getMjrStandYear error", error);
    }
  };
  getMjrStandYear();
  const getUserMsg = async (params: YearParams) => {
    try {
      const { result } = await getUserMsgApi(params);
      if (isAllEmpty(result)) {
        ElNotification?.closeAll();
        setNoticeInfo({});
        return;
      }
      const { id, title } = result;
      setNoticeInfo({ id, title });
      showNotification(title);
    } catch (error) {
      console.error("getUserMsg error", error);
    }
  };
  getUserMsg({ year: year.value });
  const showNotification = (title: Title): void => {
    ElNotification?.closeAll();
    ElNotification({
      title: "",
      customClass: "userMsgNotification",
      showClose: false,
      message: notificationMessage(title),
      duration: 0,
      offset: 39
    });
  };
  const notificationMessage = (title: Title) => {
    return h(
      "div",
      {
        class: "w-full flex justify-between items-center"
      },
      [
        h(
          "div",
          {
            class: "text-right"
          },
          [
            h("i", {
              class: "mms-iconfont iconwodexiaoxi text-[#fa8c16] mr-[10px]"
            }),
            title
          ]
        ),
        h(
          ElButton,
          {
            link: true,
            type: "primary",
            class: "ml-[20px]",
            onClick: receiveNotice
          },
          {
            default: () => "接收通知"
          }
        )
      ]
    );
  };
  const receiveNotice = (): void => {
    router.push({
      path: "/admin/notice/detail",
      query: {
        id: noticeInfo.value?.id
      }
    });
  };
  watch(
    () => year.value,
    async val => {
      getReviseNoticeByYear({ year: val });
      getUserMsg({ year: val });
    }
  );
  onBeforeUnmount(() => {
    ElNotification?.closeAll();
  });
  return {
    getUserMsg,
    getReviseNoticeByYear,
    noticeInfo,
    years,
    revise
  };
};

/**
 * @description: 年份改变
 * @param {*} yearValue 年份
 * @return {*}
 */
export const changeYear = (yearValue: number): void => {
  year.value = yearValue;
};
