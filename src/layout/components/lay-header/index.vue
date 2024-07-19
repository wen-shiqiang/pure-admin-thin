<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import LaySearch from "../lay-search/index.vue";
import LayNotice from "../lay-notice/index.vue";
import LayNavMix from "../lay-sidebar/NavMix.vue";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarTopCollapse from "../lay-sidebar/components/SidebarTopCollapse.vue";
import caretBottom from "@iconify-icons/ep/caret-bottom";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar
} = useNav();
</script>

<template>
  <div
    class="navheader bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)] flex justify-between"
  >
    <div class="flex h-[54PX] items-center ml-[36px]">
      <img class="h-[40px]" src="@/assets/image/logoMms.png" />
    </div>
    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 全屏 -->
      <!-- <LaySidebarFullScreen id="full-screen" /> -->
      <!-- 消息通知 -->
      <LayNotice id="header-notice" />
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img :src="userAvatar" :style="avatarsStyle" />
          <p v-if="username" class="text-white">{{ username }}</p>
          <IconifyIconOffline class="text-white ml-[3px]" :icon="caretBottom" />
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item class="m-[5px]">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出系统</el-dropdown-item>
            <!-- <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span class="setting-icon" title="打开系统配置" @click="onPanel">
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;
  color: #fff;
}
.navheader {
  width: 100%;
  height: 54px;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(108, 159, 249, 1) 0%,
    rgba(58, 102, 240, 1) 100%
  );
  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
