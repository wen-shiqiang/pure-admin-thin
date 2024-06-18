<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  }
});
</script>
