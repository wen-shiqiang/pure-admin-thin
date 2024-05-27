<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  getDateFormat,
  getCoverByTempId,
  getCoverDatasource,
  addTextDialog
} from "./utils/index";
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
          <span class="select" title="字体">微软雅黑</span>
          <div class="options w-[120px] !p-0">
            <el-scrollbar height="500px">
              <ul class="p-[10px]">
                <li
                  data-family="Microsoft YaHei"
                  style="font-family: Microsoft YaHei"
                >
                  微软雅黑
                </li>
                <li data-family="宋体" style="font-family: 宋体">宋体</li>
                <li data-family="黑体" style="font-family: 黑体">黑体</li>
                <li data-family="仿宋" style="font-family: 仿宋">仿宋</li>
                <li data-family="楷体" style="font-family: 楷体">楷体</li>
                <li data-family="等线" style="font-family: 等线">等线</li>
                <li data-family="华文琥珀" style="font-family: 华文琥珀">
                  华文琥珀
                </li>
                <li data-family="华文楷体" style="font-family: 华文楷体">
                  华文楷体
                </li>
                <li data-family="华文隶书" style="font-family: 华文隶书">
                  华文隶书
                </li>
                <li data-family="华文新魏" style="font-family: 华文新魏">
                  华文新魏
                </li>
                <li data-family="华文行楷" style="font-family: 华文行楷">
                  华文行楷
                </li>
                <li data-family="华文中宋" style="font-family: 华文中宋">
                  华文中宋
                </li>
                <li data-family="华文彩云" style="font-family: 华文彩云">
                  华文彩云
                </li>
                <li data-family="Arial" style="font-family: Arial">Arial</li>
                <li data-family="Segoe UI" style="font-family: Segoe UI">
                  Segoe UI
                </li>
                <li data-family="Ink Free" style="font-family: Ink Free">
                  Ink Free
                </li>
                <li data-family="Fantasy" style="font-family: Fantasy">
                  Fantasy
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
        <div class="menu-item__size">
          <span class="select" title="字体">小四</span>
          <div class="options !p-0">
            <el-scrollbar height="500px">
              <ul class="p-[10px]">
                <li data-size="56">初号</li>
                <li data-size="48">小初</li>
                <li data-size="34">一号</li>
                <li data-size="32">小一</li>
                <li data-size="29">二号</li>
                <li data-size="24">小二</li>
                <li data-size="21">三号</li>
                <li data-size="20">小三</li>
                <li data-size="18">四号</li>
                <li data-size="16">小四</li>
                <li data-size="14">五号</li>
                <li data-size="12">小五</li>
                <li data-size="10">六号</li>
                <li data-size="8">小六</li>
                <li data-size="7">七号</li>
                <li data-size="6">八号</li>
              </ul>
            </el-scrollbar>
          </div>
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
          <i />
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
          </div>
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
        <div class="menu-item__control">
          <i title="控件" />
          <div class="options">
            <ul>
              <li class="data-text" data-control="dataText">文本</li>
              <li class="data-table" data-control="table">表格</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menu-divider" />
      <div class="menu-item">
        <!-- <div class="menu-item__print" data-menu="print">
          <i />
        </div> -->
        <div class="menu-item__save !w-[52px] m-l-10" data-menu="save">
          <el-button size="small" class="sure-btn" type="primary">
            保 存
          </el-button>
          <!-- <i /> -->
        </div>
      </div>
    </div>
    <div class="editor" />
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
}
</style>
