<script setup lang="ts">
defineOptions({
  name: "emptyState"
});
import { ref, reactive, onMounted, onBeforeUnmount, toRaw } from "vue";
import UserFooter from "@/views/login/userFooter.vue";
onMounted(() => {});
onBeforeUnmount(() => {});
</script>

<template>
  <div class="my-majors-container">
    <div class="empty-null">
      <img alt="" src="@/assets/image/data_null.png" />
      <p class="text-[#51606e] text-[14px]">对不起，您没有权限，请联系管理员</p>
    </div>
    <user-footer class="footer-black" />
  </div>
</template>
<style lang="scss" scoped>
.my-majors-container {
  margin: 0 !important;
  background-color: #fff;
  height: 100%;
  .empty-null {
    width: 100%;
    text-align: center;
    padding: 50px 0;
  }
  :deep(.footer-black) {
    .img-logo {
      background: url("@/assets/login/footer-logo-dark.png") no-repeat !important;
    }
    .foot-text {
      color: rgba(81, 96, 110, 0.8);
    }
  }
}
</style>
