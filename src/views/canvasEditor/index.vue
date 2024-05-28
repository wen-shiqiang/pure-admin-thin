<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  getDateFormat,
  getCoverByTempId,
  getCoverDatasource,
  addTextDialog,
  showEdit,
  dataTable,
  dataText,
  fontOptions,
  fontValue,
  changeFontValue,
  fontSizeValue,
  fontSizeOptions,
  changeFontSizeValue,
  titleValue,
  titleValueOptions,
  changeTitleValue
} from "./utils/index";
import arroDown from "@iconify-icons/ep/arrow-down";
import addText from "./components/addText.vue";
import { setTempId, saveAdd } from "./utils/canvasEditor";
import { useRoute } from "vue-router";
const route = useRoute();
const query = ref(route.query);
const { id, token }: any = query.value || {};
sessionStorage.setItem("mmsToken", token || "");
setTempId(id);
getDateFormat();
getCoverDatasource();
onMounted(() => {
  getCoverByTempId(id);
});
window.addEventListener("message", event => {
  console.log("Received message:", event.data);
  if (event.data === "save") {
    saveAdd(1);
  }
});
const handleCommand = (command: string) => {
  console.log(command);
  switch (command) {
    case "table":
      dataTable();
      break;
    case "text":
      console.log("text");
      dataText();
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="coverConfiguration">
    <div class="menu" editor-component="menu">
      <div class="menu-item">
        <div class="menu-item__undo">
          <i />
        </div>
        <div class="menu-item__redo">
          <i />
        </div>
        <div class="menu-item__painter" title="格式刷(双击可连续使用)">
          <i />
        </div>
        <div class="menu-item__format" title="清除格式">
          <i />
        </div>
      </div>
      <div class="menu-divider" />
      <div class="menu-item">
        <div class="menu-item__font">
          <el-select
            v-model="fontValue"
            size="small"
            placeholder="Select"
            @change="changeFontValue"
          >
            <el-option
              v-for="item in fontOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="menu-item__size">
          <el-select
            v-model="fontSizeValue"
            size="small"
            placeholder="Select"
            @change="changeFontSizeValue"
          >
            <el-option
              v-for="item in fontSizeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="menu-item__size-add">
          <i />
        </div>
        <div class="menu-item__size-minus">
          <i />
        </div>
        <div class="menu-item__bold">
          <i />
        </div>
        <div class="menu-item__italic">
          <i />
        </div>
        <div class="menu-item__underline">
          <i />
          <span class="select" />
          <div class="options">
            <ul>
              <li data-decoration-style="solid">
                <i />
              </li>
              <li data-decoration-style="double">
                <i />
              </li>
              <li data-decoration-style="dashed">
                <i />
              </li>
              <li data-decoration-style="dotted">
                <i />
              </li>
              <li data-decoration-style="wavy">
                <i />
              </li>
            </ul>
          </div>
        </div>
        <div class="menu-item__strikeout" title="删除线(Ctrl+Shift+X)">
          <i />
        </div>
        <div class="menu-item__color" title="字体颜色">
          <i />
          <span />
          <input id="color" type="color" />
        </div>
        <div class="menu-item__highlight" title="高亮">
          <i />
          <span />
          <input id="highlight" type="color" />
        </div>
      </div>
      <div class="menu-divider" />
      <div class="menu-item">
        <div class="menu-item__title">
          <el-select
            v-model="titleValue"
            :empty-values="[null, undefined]"
            size="small"
            placeholder="Select"
            @change="changeTitleValue"
          >
            <el-option
              v-for="item in titleValueOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <!-- <i />
          <span class="select" title="切换标题">正文</span>
          <div class="options">
            <ul>
              <li style="font-size: 16px">正文</li>
              <li data-level="first" style="font-size: 26px">标题1</li>
              <li data-level="second" style="font-size: 24px">标题2</li>
              <li data-level="third" style="font-size: 22px">标题3</li>
              <li data-level="fourth" style="font-size: 20px">标题4</li>
              <li data-level="fifth" style="font-size: 18px">标题5</li>
              <li data-level="sixth" style="font-size: 16px">标题6</li>
            </ul>
          </div> -->
        </div>
        <div class="menu-item__left">
          <i />
        </div>
        <div class="menu-item__center">
          <i />
        </div>
        <div class="menu-item__right">
          <i />
        </div>
      </div>
      <div class="menu-divider" />
      <div class="menu-item">
        <div class="menu-item__table">
          <i title="表格" />
        </div>
        <div class="menu-item__table__collapse">
          <div class="table-close">×</div>
          <div class="table-title">
            <span class="table-select">插入</span>
            <span>表格</span>
          </div>
          <div class="table-panel" />
        </div>
        <div class="menu-item__image">
          <i title="图片" />
          <input
            id="image"
            type="file"
            accept=".png, .jpg, .jpeg, .svg, .gif"
          />
        </div>
        <div class="menu-item__control !w-[88px]">
          <el-dropdown
            class="dropdown-data"
            :popper-class="'dropdown__popper-data'"
            @command="handleCommand"
          >
            <!-- <el-button size="small" type="primary"> 设置数据源 </el-button> -->
            <el-button size="small" class="sure-btn" text type="primary">
              设置数据源<IconifyIconOffline class="ml-[2px]" :icon="arroDown" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  class="data-text"
                  command="text"
                  data-control="dataText"
                  >文本</el-dropdown-item
                >
                <el-dropdown-item
                  class="data-table"
                  command="table"
                  data-control="table"
                >
                  表格
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- <el-button size="small" class="sure-btn" type="primary" plain>
            设置数据源
          </el-button>
          <div class="options !left-[0]">
            <ul>
              <li class="data-text" data-control="dataText">文本</li>
              <li class="data-table" data-control="table">表格</li>
            </ul>
          </div> -->
        </div>
        <div class="menu-item__reset !w-[72px] !ml-[5px]" data-menu="reset">
          <el-button size="small" class="sure-btn" type="primary" plain>
            恢复默认
          </el-button>
        </div>
      </div>
      <div class="menu-divider" />
      <div class="menu-item">
        <div class="menu-item__save !w-[52px]" data-menu="save">
          <el-button size="small" class="sure-btn" type="primary">
            保 存
          </el-button>
        </div>
      </div>
    </div>
    <div v-if="showEdit" class="editor" />
    <div class="footer" editor-component="footer">
      <div />
      <div>
        <div class="page-scale-minus" title="缩小(Ctrl+-)">
          <i />
        </div>
        <span class="page-scale-percentage" title="显示比例(点击可复原Ctrl+0)"
          >100%</span
        >
        <div class="page-scale-add" title="放大(Ctrl+=)">
          <i />
        </div>
        <div class="fullscreen" title="全屏显示">
          <i />
        </div>
      </div>
    </div>
    <addText :dialog="addTextDialog" />
  </div>
</template>

<style>
@import url("./style.css");
</style>

<style lang="scss">
.coverConfiguration {
  height: 100%;
  overflow: auto;
  .dropdown-data {
    .el-button.is-text:not(.is-disabled):focus-visible {
      outline: 0;
      outline-offset: 0;
    }
    .el-button.is-text:not(.is-disabled):hover {
      background: rgba(0, 0, 0, 0) !important;
    }
  }
}
.dropdown__popper-data {
  .el-dropdown-menu__item {
    padding: 5px 25px;
  }
}
</style>
