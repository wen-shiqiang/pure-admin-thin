<template>
  <el-config-provider :locale="currentLocale">
    <router-view v-if="isRouterAlive" />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { provide, ref, defineComponent, nextTick } from "vue";
import { ElConfigProvider } from "element-plus";
import { ReDialog } from "@/components/ReDialog";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  setup() {
    const { overallStyle, dataThemeChange } = useDataThemeChange();
    dataThemeChange(overallStyle.value);
    const isRouterAlive = ref(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    };
    provide("reload", reload);
    return {
      isRouterAlive
    };
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
