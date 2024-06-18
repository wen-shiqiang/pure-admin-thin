<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  inject,
  onBeforeUnmount
} from "vue";
import { useRoute, useRouter } from "vue-router";
// import { useStore } from "vuex";
import * as mUtils from "@/utils/mUtils";
import md5 from "js-md5";
// import UserFooter from "./userFooter";
import logoPng from "@/assets/login/logo.png";
import { object } from "vue-types";
defineOptions({
  name: "mmsLogin"
});
const reload = inject("reload");
const route = useRoute();
const router = useRouter();
// const store = useStore();

const logopath = ref("");
const logo_name = ref("");
const schoolId = ref(route.params.schlId || "");
const captchaCodeImg = ref("");
const loading = ref(false);
const loginError = ref(false);
const errorText = ref("");
const clearable = ref(true);

const rules = {
  account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captchaCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

const loginForm = reactive({
  account: "admin",
  password: "123456",
  captchaCode: "",
  uuid: ""
});
const ruleForm = reactive({
  username: "admin",
  password: "admin123"
});
Object.assign(ruleForm, {
  username: "admin11111111"
});
console.log("ruleForm", ruleForm);

const getSchoolInfo = async () => {
  sessionStorage.clear();
  // const data = await mUtils.getRequest("/user/v1/getSchoolInfo", {
  //   schoolNum: schoolId.value
  // });
  // if (data.data.status === 200 && data.data.result) {
  //   logopath.value = data.data.result.logopath
  //     ? window.mms.csgmooc + data.data.result.logopath
  //     : logoPng;
  //   const logo_name_temp =
  //     data.data.result.platformName || "人才培养方案研制平台";
  //   if (logo_name_temp.length > 11) {
  //     logo_name.value = `${logo_name_temp.substring(0, 11)}<br />${logo_name_temp.substring(11)}`;
  //   } else {
  //     logo_name.value = logo_name_temp;
  //   }
  //   data.data.result.logoLight &&
  //     sessionStorage.setItem("mmsLogoLight", data.data.result.logoLight);
  //   data.data.result.platformName &&
  //     sessionStorage.setItem("mmsPlatformName", data.data.result.platformName);
  // } else {
  //   logopath.value = logoPng;
  //   logo_name.value = "人才培养方案研制平台";
  // }
};

const getGenerateCode = async () => {
  // const data = await mUtils.getImgRequest("/user/v1/generateCode", {
  //   uuid: loginForm.uuid
  // });
  // if (data.status === 200) {
  //   captchaCodeImg.value = window?.URL?.createObjectURL(data.data) || "";
  // }
};

const saveUserInfo = () => {
  const userName = loginForm.account;
  const userinfo = { username: userName };
  mUtils.setseStore("mms-userInfo", userinfo);
};

const userLogin = async () => {
  sessionStorage.removeItem("mmsUnifyLoading");
  const formdata = {
    schoolNum: schoolId.value || "test02",
    number: loginForm.account,
    password: md5(loginForm.password),
    uuid: loginForm.uuid,
    captchaCode: loginForm.captchaCode,
    ptlId: 2
  };
  // const data = await mUtils.postRequest("user/v1/login", formdata);
  // if (data.data.status === 200) {
  //   const str = location.href;
  //   const arraystr = str.split("/");
  //   if (arraystr[3].indexOf("#") === -1) {
  //     localStorage.setItem("arraystr", arraystr[3]);
  //   }
  //   localStorage.setItem("fileFlag", false);
  //   const tokenVal = data.data.result.token;
  //   mUtils.setseStore("token", tokenVal);
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
  // } else {
  //   this.$message.error(data.data.message);
  // }
  getGenerateCode();
};

const getMenuByUserId = async () => {
  const userId = mUtils.getseStore("userId");
  const formData = { id: userId };
  // const data = await mUtils.getRequest(
  //   "majorManage/v1/getMenuByUserId",
  //   formData
  // );
  // if (data.data.status === 200) {
  //   loading.value = false;
  //   data.data.result.find(item => {
  //     if (item.menuName == "审批") {
  //       mUtils.setseStore("menusp", item.childMenu);
  //     }
  //   });
  // } else {
  //   loading.value = false;
  //   this.$message.error(data.data.message);
  // }
};

const submitClick = formName => {
  // loginForm.validate(valid => {
  //   if (valid) {
  //     saveUserInfo();
  //     userLogin();
  //   } else {
  //     return false;
  //   }
  // });
};

onMounted(() => {
  getSchoolInfo();
  // mUtils.getRequest("/user/v1/getUUID").then(data => {
  //   if (data.data.status === 200) {
  //     loginForm.uuid = data.data?.result || "";
  //     getGenerateCode();
  //   }
  // });
});
onMounted(() => {});

onBeforeUnmount(() => {});
</script>

<template>
  <div class="login_bg">
    <div class="login-container">
      <div class="contain-div">
        <el-form
          ref="loginForm"
          v-loading="loading"
          :model="loginForm"
          :rules="rules"
          class="login_right"
          label-position="left"
          label-width="0px"
        >
          <div class="loginLogo">
            <img alt :src="logopath" />
          </div>
          <div class="login_smallHr" v-html="logo_name" />
          <div class="small_container">
            <el-input
              v-model="ruleForm.username"
              clearable
              placeholder="账号"
            />
            <el-form-item prop="account">
              <i class="ioc_per" style="position: absolute; z-index: 9" />
              <el-input
                v-model="ruleForm.username"
                prefix-icon="ioc"
                type="text"
                class="login-input"
                placeholder="用户名"
                @keyup.enter="submitClick('loginForm')"
              />
            </el-form-item>
            <el-form-item prop="password">
              <i class="ioc_password" style="position: absolute; z-index: 9" />
              <el-input
                v-model="loginForm.password"
                prefix-icon="ioc"
                type="password"
                class="login-input"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter="submitClick('loginForm')"
              />
            </el-form-item>
            <el-form-item class="captchaCodeFormItem" prop="captchaCode">
              <i class="ioc_captchaCode" style="position: absolute; z-index: 9">
                <svg-icon
                  icon-class="icon-captchaCode"
                  class-name="captchaCode"
                  class="captchaCode-icon"
                />
              </i>
              <el-input
                v-model="loginForm.captchaCode"
                type="text"
                prefix-icon="ioc"
                class="login-input captchaCode-input"
                clearable="clearable"
                auto-complete="off"
                placeholder="验证码"
                maxlength="4"
                @keyup.enter="submitClick('loginForm')"
              >
                <template #append>
                  <img
                    v-if="captchaCodeImg"
                    title="看不清，换一张"
                    class="h-50 w-140 c-p"
                    :src="captchaCodeImg"
                    alt="请点击刷新"
                    @click="getGenerateCode()"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="login-item">
              <el-button
                type="primary"
                class="login-btn"
                :loading="loading"
                @click.prevent="submitClick('loginForm')"
                >登录</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- <UserFooter /> -->
  </div>
</template>

<style lang="scss" scoped>
#login_msg {
  color: #f56c6c;
  font-size: 14px;
  text-align: center;
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
  .foot-text {
    color: rgba(255, 255, 255, 0.7) !important;
    a {
      color: rgba(255, 255, 255, 0.7) !important;
    }
  }
  .img-logo {
    background: url("@/assets/login/login-logo.png") no-repeat !important;
    opacity: 0.8;
  }
  .login-container {
    border-radius: 8px;
    background: #fff;
    text-align: center;
    min-width: 380px;
    min-height: 440px;
    position: absolute;
    top: 50%;
    left: 62%;
    transform: translateY(-50%);
    .contain-div {
      position: relative;
      margin-top: 37px;
      .forgetPwd {
        position: absolute;
        right: 36px;
        bottom: 70px;
        color: #aeb5bb;
        cursor: pointer;
      }
      .login_left {
        width: 348px;
        height: 535px;
        background-image: url("@/assets/login/left-bg.png");
        float: left;
      }
      .login_right {
        width: 380px;
        padding: 80px 26px 72px;
        .loginLogo {
          position: absolute;
          left: 164px;
          top: 0;
          img {
            max-height: 60px;
          }
        }
        .ioc_per {
          width: 26px;
          height: 15px;
          margin-top: 10px;
          margin-left: 5px;
          padding-right: 5px;
          border-right: 1px solid #c5d0da;
          vertical-align: middle;
          display: inline-block;
          background: url("@/assets/login/icon-common.png") no-repeat 0px -189px;
        }
        .ioc_password {
          width: 26px;
          height: 15px;
          margin-top: 10px;
          margin-left: 5px;
          padding-right: 5px;
          border-right: 1px solid #c5d0da;
          vertical-align: middle;
          display: inline-block;
          background: url("@/assets/login/icon-common.png") no-repeat -26px -189px;
        }
        .ioc_captchaCode {
          width: 31px;
          height: 15px;
          margin-top: 24px;
          padding-right: 5px;
          border-right: 1px solid #c5d0da;
          vertical-align: middle;
          display: inline-block;
        }
        .captchaCode-input {
          height: 50px;
          .el-input__inner {
            margin-top: 18px;
            width: 150px;
          }
          .el-input-group__append {
            width: 142px;
            background: #fff;
            padding: 0;
            border: 1px solid #dcdfe6;
          }
        }
        .captchaCode-icon {
          height: 18px;
          width: 18px;
          vertical-align: super;
        }
        .login-input {
          input {
            border: none;
            border-radius: 0;
            border-bottom: 1px solid #c5d0da;
            &:hover {
              border-color: #9aabb8;
            }
          }
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
.el-input--prefix > .el-input__inner {
  padding-left: 40px !important;
}
.login_logo {
  width: 50px;
  height: 50px;
  display: inline-block;
  vertical-align: middle;
  background-image: url("@/assets/login/login_logo.png");
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}

.login_smallHr {
  color: #2c3e50;
  font-size: 28px;
  text-align: center;
  padding-bottom: 15px;
  font-family: "微软雅黑";
  line-height: 42px;
  letter-spacing: 1px;
}

.small_container {
  margin: 0px 15px 0px 15px;
  position: relative;
  .loginToAdmin {
    position: absolute;
    left: 0;
    top: 122px;
  }
}

.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}

.remember_password {
  color: #3384d5;
  font-size: 14px;
  text-align: center;
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}

.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
