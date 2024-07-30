import { ref } from "vue";
import { useApiRequests } from "./request";
import { storageSession, storageLocal } from "@pureadmin/utils";
import { logoPng } from "./static";
import type { FormInstance } from "element-plus";
import { md5 } from "js-md5";
import { useRoute, useRouter } from "vue-router";
import { useTokenStoreHook } from "@modules/token";
import { useUserInfoStoreHook } from "@modules/userInfo";
export const logoName = ref("");
export const logoPath = ref("");
export const captchaCodeImg = ref(null);
export const ruleFormRef = ref<FormInstance>();
export const loginRun = () => {
  const { getUUIDApi, getSchoolInfoApi, generateCodeApi, loginApi } =
    useApiRequests();
  const route = useRoute();
  const router = useRouter();
  const schoolNum = route?.params?.schlId || "";
  const getUUID = async () => {
    try {
      return (await getUUIDApi()).result;
    } catch (error) {
      console.error("getUUID error", error);
      return null;
    }
  };
  const generateCode = async (uuid: null) => {
    try {
      const data: any = await generateCodeApi({ uuid });
      captchaCodeImg.value = window?.URL?.createObjectURL(data) ?? null;
      return uuid;
    } catch (error) {
      console.error("generateCode error", error);
      return null;
    }
  };
  const getSchoolInfo = async params => {
    try {
      const { result } = await getSchoolInfoApi(params);
      const { logopath, platformName, logoLight } = result || {
        logopath: "",
        platformName: "",
        logoLight: ""
      };
      logoPath.value = logopath ? window.mms.csgmooc + logopath.value : logoPng;
      logoName.value = platformName || "人才培养方案研制平台";
      logoLight && storageSession().setItem("mmsLogoLight", logoLight);
      platformName && storageSession().setItem("mmsPlatformName", platformName);
    } catch (error) {
      logoPath.value = logoPng;
      logoName.value = "人才培养方案研制平台";
      console.error("getSchoolInfo error", error);
    }
  };
  getSchoolInfo({ schoolNum });
  const login = async params => {
    try {
      const { result } = await loginApi(params);
      return result;
    } catch (error) {
      console.error("login error", error);
      return null;
    }
  };
  const submitClick = async (formEl: FormInstance | undefined, ruleForm) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const form: any = { ...ruleForm, schoolNum };
        form.password = md5(ruleForm.password);
        userLogin(await login(form));
      } else {
        console.log("error submit!", fields);
      }
    });
  };
  const userLogin = result => {
    try {
      if (!result) {
        throw new Error("Login result is null or undefined");
      }
      const { token, headMenu, userInfo, menuList } = result;
      if (!menuList?.length) {
        router.push("/user/emptyState");
        storageSession().setItem("isShowBtn", false);
      }
      const str = location.href; // 取得整个地址栏
      let arraystr: any = str.split("/");
      if (arraystr[3].indexOf("#") === -1) {
        arraystr = arraystr[3];
        storageLocal().setItem("arraystr", arraystr);
      }
      useTokenStoreHook().setToken(token);
      useUserInfoStoreHook().setUserInfo(userInfo);
      // storageSession().setItem("token", token);
      storageSession().setItem("headMenu", headMenu);
      // storageSession().setItem("mms-userInfo", userInfo);
      //   // store.commit("tokenChange");
      //   if (!data.data.result.menuList?.length) {
      //     router.push("/user/emptyState");
      //     mUtils.setseStore("isShowBtn", false);
      //   }
      //   if (data.data.result.menuList.length > 0) {
      //     data.data.result.headMenu.forEach(item => {
      //       if (item.menuName == "审批") {
      //         mUtils.setseStore("menusp", item.childMenu);
      //       }
      //     });
      //     if (data.data.result.menuList[0].menuUrl) {
      //       router.push(data.data.result.menuList[0].menuUrl);
      //     } else {
      //       data.data.result.menuList.forEach(item => {
      //         if (item.menuType == 2) {
      //           mUtils.setseStore("majNav", item.childMenu);
      //         }
      //       });
      //       router.push(data.data.result.menuList[0].childMenu[0].menuUrl);
      //     }
      //     mUtils.setseStore("isShowBtn", true);
      //   }
      //   getMenuByUserId();
      //   const breadcrumbArr = {};
      //   data.data.result.menuList.forEach(item => {
      //     if (item.menuUrl) {
      //       item.breadcrumb = item.menuName;
      //       breadcrumbArr[item.menuUrl] = [item.breadcrumb];
      //     } else {
      //       item.childMenu.forEach(item1 => {
      //         item1.breadcrumb = [item.menuName, item1.menuName];
      //         breadcrumbArr[item1.menuUrl] = item1.breadcrumb;
      //       });
      //     }
      //   });
      //   mUtils.setseStore("menuList", data.data.result.menuList);
      //   mUtils.setseStore("buttonList", data.data.result.buttonList || []);
      //   if (data.data.result.headMenu.length > 0) {
      //     data.data.result.headMenu.forEach(item => {
      //       if (item.menuUrl) {
      //         item.breadcrumb = item.menuName;
      //         breadcrumbArr[item.menuUrl] = item.breadcrumb;
      //       } else {
      //         item.childMenu.forEach(item1 => {
      //           item1.breadcrumb = `${item.menuName} / ${item1.menuName}`;
      //           breadcrumbArr[item1.menuUrl] = item1.breadcrumb;
      //         });
      //       }
      //     });
      //   }
      //   mUtils.setseStore("breadcrumbArr", breadcrumbArr);
    } catch (error) {
      console.error("userLogin error", error);
    }
  };
  return {
    getUUID,
    getSchoolInfo,
    generateCode,
    login,
    submitClick
  };
};
