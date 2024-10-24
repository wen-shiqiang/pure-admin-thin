import { ref, watch, inject } from "vue";
import { useApiRequests } from "./request";
import { storageSession, storageLocal } from "@pureadmin/utils";
import { logoPng } from "./static";
import type { FormInstance } from "element-plus";
import { md5 } from "js-md5";
import { useRoute, useRouter } from "vue-router";
import { useTokenStoreHook } from "@modules/token";
import { useUserInfoStoreHook } from "@modules/userInfo";
import { useCategoryByPageStoreHook } from "@modules/categoryByPage";
import { setToken } from "@/utils/auth";
export const logoName = ref("");
export const logoPath = ref("");
export const schoolNum = ref("");
export const captchaCodeImg = ref(null);
export const ruleFormRef = ref<FormInstance>();

export const loginRun = () => {
  const { getUUIDApi, getSchoolInfoApi, generateCodeApi, loginApi } =
    useApiRequests();
  const reload = inject("reload", () => {});
  const route = useRoute();
  const router = useRouter();
  watch(
    () => route.fullPath,
    () => {
      reload();
    }
  );
  const schlId = route?.params?.schlId || "";
  const isLogin = route.name === "login";
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
  getSchoolInfo({ schoolNum: schlId });
  const login = async params => {
    try {
      const { result } = await loginApi(params);
      result.uuid = params.uuid;
      return result;
    } catch (error) {
      console.error("login error", error);
      generateCode(params.uuid);
      return null;
    }
  };
  const submitClick = async (formEl: FormInstance | undefined, ruleForm) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
      if (valid) {
        const form: any = { ...ruleForm };
        form.password = md5(ruleForm.password);
        form.schoolNum = isLogin ? schoolNum.value : schlId;
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
      const { token, headMenu, userInfo, menuList, buttonList } = result;
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
      storageSession().setItem("headMenu", headMenu);
      setToken({
        username: userInfo.number,
        roles: ["admin"],
        accessToken: token
      } as any);
      const breadcrumbArr = {};
      menuList.forEach((item, mi) => {
        item.meta = {
          // icon: item.menuIcon?.split(" ")[1] || "",
          icon: item.menuIcon || "",
          menu: 1,
          title: item.menuName
        };
        item.path = item.menuUrl ?? `/path${mi}`;
        if (item.menuUrl) {
          item.breadcrumb = item.menuName;
          breadcrumbArr[item.menuUrl] = [item.breadcrumb];
        } else {
          item.childMenu.forEach(item1 => {
            item1.path = item1.menuUrl;
            item1.breadcrumb = [item.menuName, item1.menuName];
            breadcrumbArr[item1.menuUrl] = item1.breadcrumb;
            item1.meta = {
              icon: "",
              menu: 1,
              title: item1.menuName
            };
          });
          item.children = item.childMenu;
        }
      });
      if (menuList[0].menuUrl) {
        router.push(menuList[0].menuUrl);
      } else {
        menuList.forEach(item => {
          if (item.menuType == 2) {
            storageSession().setItem("majNav", item.childMenu);
          }
        });
        router.push(menuList[0].childMenu[0].menuUrl);
      }
      storageSession().setItem("isShowBtn", true);
      storageSession().setItem("menuList", menuList);
      storageSession().setItem("buttonList", buttonList);
      if (headMenu.length) {
        headMenu.forEach(item => {
          if (item.menuUrl) {
            item.breadcrumb = item.menuName;
            breadcrumbArr[item.menuUrl] = item.breadcrumb;
          } else {
            item.childMenu.forEach(item1 => {
              item1.breadcrumb = `${item.menuName} / ${item1.menuName}`;
              breadcrumbArr[item1.menuUrl] = item1.breadcrumb;
            });
          }
        });
      }
      storageSession().setItem("breadcrumbArr", breadcrumbArr);
      useCategoryByPageStoreHook().getDateCategoryByPage();
    } catch (error) {
      console.error("userLogin error", error);
    }
  };
  return {
    getUUID,
    getSchoolInfo,
    generateCode,
    login,
    submitClick,
    isLogin
  };
};
