<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, toRaw } from "vue";
import { useRequest, useSessionStorageState } from "vue-hooks-plus";
import {
  getUUIDRequest,
  generateCodeRequest,
  getSchoolInfoRequest,
  loginRequest
} from "./utils/request";
import { storageSession } from "@pureadmin/utils";
import captchaCode from "@/assets/login/icon-captchaCode.svg?component";
import user from "@/assets/login/icon-user.svg?component";
import password from "@/assets/login/icon-password.svg?component";
import { ElMessage, type FormInstance } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { md5 } from "js-md5";
import UserFooter from "./userFooter.vue";
import logoPng from "@/assets/login/logo.png";
defineOptions({
  name: "mmsLogin"
});
const route = useRoute();
const ruleFormRef = ref<FormInstance>();
const schoolNum = route?.params?.schlId || "";
if (!schoolNum) {
  ElMessage.error("学校编码为空");
}
const router = useRouter();
const logoName = ref("");
const loading = ref(false);
const captchaCodeImg = ref(null);

useRequest(() => getUUIDRequest(), {
  debugKey: "getUUIDRequest",
  onSuccess: (data: any) => {
    ruleForm.uuid = data;
    data && run(data);
  }
});
const { run } = useRequest(uuid => generateCodeRequest({ uuid }), {
  manual: true,
  debugKey: "generateCodeRequest",
  onSuccess: (data: any) => {
    captchaCodeImg.value = window?.URL?.createObjectURL(data) ?? null;
  }
});
const { run: loginRun } = useRequest(params => loginRequest(params), {
  manual: true,
  debugKey: "loginRequest",
  onSuccess: (data: any) => {
    userLogin(data);
  }
});
const logopath = ref("");
useRequest(() => getSchoolInfoRequest({ schoolNum }), {
  debugKey: "getSchoolInfoRequest",
  onSuccess: (result: any) => {
    const { logopath, platformName, logoLight } = result || {
      logopath: logoPng,
      platformName: "",
      logoLight: ""
    };
    logopath.value = logopath ? window.mms.csgmooc + logopath : logoPng;
    logoName.value = platformName || "人才培养方案研制平台";
    logoLight && sessionStorage.setItem("mmsLogoLight", logoLight);
    platformName && sessionStorage.setItem("mmsPlatformName", platformName);
  },
  onError: () => {
    logopath.value = logoPng;
    logoName.value = "人才培养方案研制平台";
  }
});

const rules = {
  number: [
    { required: true, message: "请输入账号", trigger: ["change", "blur"] }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["change", "blur"] }
  ],
  captchaCode: [
    { required: true, message: "请输入验证码", trigger: ["change", "blur"] }
  ]
};

const ruleForm = reactive({
  number: "",
  password: "",
  captchaCode: "",
  uuid: ""
});

const userLogin = result => {
  const { token, headMenu, userInfo, menuList } = result;
  if (!menuList?.length) {
    router.push("/user/emptyState");
    storageSession().setItem("isShowBtn", false);
  }
  storageSession().setItem("token", token);
  storageSession().setItem("headMenu", headMenu);
  storageSession().setItem("mms-userInfo", userInfo);
  //   const str = location.href;
  //   const arraystr = str.split("/");
  //   if (arraystr[3].indexOf("#") === -1) {
  //     localStorage.setItem("arraystr", arraystr[3]);
  //   }
  //   localStorage.setItem("fileFlag", false);

  //   mUtils.setseStore("headMenu", data.data.result.headMenu);
  //   mUtils.setseStore("mms-userInfo", data.data.result.userInfo);
  //   mUtils.setseStore("schoolNum", data.data.result.userInfo.schoolNum);
  //   mUtils.setseStore("userId", data.data.result.userInfo.userId);
  //   mUtils.setseStore("userName", data.data.result.userInfo.name);
  //   mUtils.setseStore("headcolor", data.data.result.userInfo.headcolor);
  //   mUtils.setseStore("isSkipBack", data.data.result.userInfo.isSkipBack);
  //   mUtils.setseStore("logNum", data.data.result.userInfo.logNum);
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
};
const submitClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const form: any = { ...ruleForm };
      form.password = md5(ruleForm.password);
      form.ptlId = 2;
      form.schoolNum = schoolNum;
      loginRun(form);
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(() => {});
onBeforeUnmount(() => {});
</script>

<template>
  <div class="login_bg">
    <div class="login-container">
      <div class="contain-div">
        <div>
          <img alt="" :src="logopath" class="max-h-[60px]" />
        </div>
        <div
          class="login_smallHr text-[#2c3e50] dark:text-[--el-text-color-primary]"
          v-html="logoName"
        />
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="login_right"
          label-width="0px"
        >
          <el-form-item prop="number">
            <el-input
              v-model="ruleForm.number"
              class="login-input"
              clearable
              placeholder="用户名"
            >
              <template v-slot:prefix>
                <component
                  :is="toRaw(user)"
                  fill="#9AABB9"
                  class="ioc pr-[9px]"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              class="login-input"
              clearable
              placeholder="密码"
              show-password
            >
              <template v-slot:prefix>
                <component
                  :is="toRaw(password)"
                  fill="#9AABB9"
                  class="ioc pr-[9px]"
                />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="captchaCodeFormItem" prop="captchaCode">
            <el-row class="flex items-end">
              <el-col :span="13" class="!inline-flex">
                <el-input
                  v-model="ruleForm.captchaCode"
                  type="text"
                  class="login-input"
                  auto-complete="off"
                  placeholder="验证码"
                  maxlength="4"
                >
                  <template v-slot:prefix>
                    <component
                      :is="toRaw(captchaCode)"
                      fill="#9AABB9"
                      class="ioc pr-[9px]"
                    />
                  </template>
                </el-input>
              </el-col>
              <el-col :span="11" class="!flex justify-end">
                <img
                  title="看不清，换一张"
                  class="h-[50px] c-p border border-[#DCDFE6]"
                  :src="captchaCodeImg"
                  alt="请点击刷新"
                  @click="run(ruleForm.uuid)"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="login-item">
            <el-button
              type="primary"
              class="login-btn"
              size="large"
              :loading="loading"
              @click.prevent="submitClick(ruleFormRef)"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <UserFooter />
  </div>
</template>
<style lang="scss" scoped>
.login-input {
  :deep(.el-input__wrapper) {
    box-shadow: var(--el-border-color) 0 1px 0px 0px;
    border-radius: 0;
    &:hover {
      box-shadow: var(--el-border-color-hover) 0 1px 0px 0px;
    }
    &.is-focus {
      box-shadow: var(--el-input-focus-border-color) 0 1px 0px 0px;
    }
  }
}
:deep(.el-form-item) {
  &.is-error {
    .el-input__wrapper {
      box-shadow: var(--el-color-danger) 0 1px 0px 0px !important;
    }
  }
}
.login_bg {
  height: 100%;
  width: 100%;
  min-height: 640px;
  padding-top: 1px;
  box-sizing: border-box;
  position: relative;
  background: url("@/assets/login/login_bg.png") no-repeat;
  background-size: cover;
  min-width: 1024px;
  .login-container {
    border-radius: 8px;
    background: var(--el-bg-color);
    text-align: center;
    width: 380px;
    min-height: 440px;
    position: absolute;
    top: 50%;
    left: 62%;
    transform: translateY(-50%);
    .contain-div {
      position: relative;
      margin-top: 37px;
      .login_right {
        width: 380px;
        padding: 10px 30px 72px;
        .ioc {
          width: 26px;
          height: 16px;
          margin-right: 15px;
          border-right: 1px solid #c5d0da;
          vertical-align: middle;
          display: inline-block;
        }
        .login-item {
          width: 100%;
          margin-top: 37px;
          .login-btn {
            width: 100%;
            color: #fff;
            margin-top: 20px;
            border-color: transparent;
            background: -webkit-linear-gradient(
              left,
              #7fa3fd,
              #5c8ef2
            ); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(
              right,
              #7fa3fd,
              #5c8ef2
            ); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(
              right,
              #7fa3fd,
              #5c8ef2
            ); /* Firefox 3.6 - 15 */
            background: linear-gradient(
              to right,
              #7fa3fd,
              #5c8ef2
            ); /* 标准的语法 */
          }
        }
      }
    }
  }
}
.login_smallHr {
  font-size: 28px;
  text-align: center;
  font-family: "微软雅黑";
  line-height: 42px;
  letter-spacing: 1px;
  margin: 20px 30px 15px 30px;
}
</style>
