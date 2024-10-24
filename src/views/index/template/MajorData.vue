<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useApiRequests } from "../utils/request";
import { useImmer } from "@vue-hooks-plus/use-immer";
import { useRouter } from "vue-router";
const router = useRouter();
defineOptions({
  name: "majorData"
});
const { getMjrStandardByCondApi } = useApiRequests();
const props = defineProps({
  year: {
    type: [String, Number],
    default: ""
  }
});
watch(
  () => props.year,
  newVal => {
    getMjrStandardByCond({ year: props.year });
  }
);
const majorAmount = ref(0);
const [majorList, updateMajorList] = useImmer([]);
const getMjrStandardByCond = async (params: any) => {
  try {
    const { result }: any = (await getMjrStandardByCondApi(params)) || {};
    majorAmount.value = result?.majorAmount ?? 0;
    updateMajorList(result?.majorList || []);
  } catch (error) {
    console.error("getDeptInfoByCondition error", error);
  }
};
getMjrStandardByCond({ year: props.year });
//   // 页面跳转
const goPage = (path, query = {}) => {
  router.push({ path: path, query: query });
};
</script>

<template>
  <div class="major">
    <div class="revise-title">
      <div class="name">
        <el-badge type="info" :value="majorAmount" :offset="[13, 14]">
          我的专业
        </el-badge>
      </div>
      <div class="name">
        <el-button
          :link="true"
          type="primary"
          @click="goPage('/admin/manageTrainingProgram')"
        >
          我的培养方案
        </el-button>
      </div>
    </div>
    <div class="major-list">
      <div v-for="(item, key) in majorList" :key="key" class="major-item">
        <div v-if="!item.roleType" class="name">
          <span class="text-[#333]">{{ item.name }}</span
          ><el-button
            @click="
              goPage(
                item.standardSimpList.length
                  ? '/admin/trainingProgram/edit'
                  : '/admin/manageTrainingProgram',
                { id: item.id, year: year }
              )
            "
          >
            开始修订
          </el-button>
        </div>
        <div v-if="item.roleType" class="name">
          <span class="text-[#333]">{{ item.name }}</span
          ><el-button
            @click="
              goPage(
                item.standardSimpList.length
                  ? '/admin/trainingProgram/edit'
                  : '/admin/manageTrainingProgram',
                { id: item.id, year: year }
              )
            "
          >
            查看详情
          </el-button>
        </div>
        <div v-if="item.standardSimpList.length > 0" class="item-list">
          <div
            v-for="(v, k) in item.standardSimpList"
            :key="k"
            class="item-list-item leading-[48px]"
          >
            <div class="item-name">
              <span>{{ v.standardName }}</span>
              <el-tag v-if="v.isDefault" class="ml-1.5" size="small">
                默认
              </el-tag>
            </div>
            <div class="item-status">
              <div v-if="v.status === 0" class="status-info">
                <span class="status-tip warning" /> 未修订
              </div>
              <div v-else-if="v.status === 1" class="status-info">
                <span class="status-tip primary" /> 修订中
              </div>
              <div v-else-if="v.status === 2" class="status-info">
                <span class="status-tip success" />
                发布中
              </div>
              <div v-else-if="v.status === 3" class="status-info">
                <span class="status-tip danger" /> 已发布
              </div>
            </div>
            <div v-if="v.roleType === 0" class="item-person">
              <i class="el-icon-user" /> 专业负责人
            </div>
            <div v-else-if="v.roleType === 1" class="item-person">
              <i class="el-icon-user" /> 专业参与人
            </div>
          </div>
        </div>
        <div v-else class="item-list">
          <div class="empty-tip">该专业下暂无当前年份的培养方案</div>
        </div>
      </div>
      <div v-if="majorList.length === 0" class="major-empty-tip">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-btn-info {
  width: 112px;
  text-align: center;
  .el-dropdown-menu__item {
    font-size: 14px;
  }
}
// 我的专业
.major {
  margin-top: 10px;
  background: #fff;
  .revise-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 14px;
    line-height: 28px;
    color: #333;
    font-weight: bold;
    border-bottom: 1px solid #f5f5f5;
  }
  .major-list {
    min-height: 50px;
    .major-empty-tip {
      color: #999;
      width: 100%;
      padding: 15px 0px 5px;
      text-align: center;
    }
    .major-item {
      margin-bottom: 10px;
      .name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        font-size: 14px;
        color: #999;
        background: rgba(92, 142, 242, 0.1);
      }
      .item-list {
        padding: 10px 20px 0px 42px;
        .empty-tip {
          font-size: 14px;
          color: #333;
          line-height: 48px;
        }
        .item-list-item {
          display: flex;
          align-items: center;
          .item-name {
            flex: 1;
            font-size: 14px;
            color: #333;
          }
          .item-status {
            width: 120px;
            font-size: 14px;
            color: #999;
            .status-info {
              .status-tip {
                width: 6px;
                height: 6px;
                border-radius: 3px;
                display: inline-block;
              }
              .success {
                background: #5bd171;
              }
              .warning {
                background: #fa8c16;
              }
              .primary {
                background: #5c8ef2;
              }
              .danger {
                background: #ff6666;
              }
            }
          }
          .item-person {
            width: 120px;
            font-size: 14px;
            color: #999;
          }
          .item-btn {
            width: 120px;
            text-align: right;
            .item-btn-info .el-button--mini {
              line-height: 14px !important;
            }
          }
        }
      }
    }
  }
  .share-title {
    font-size: 16px;
    color: #333;
    padding-bottom: 10px;
  }
  .share-content {
    height: 360px;
    overflow: hidden;
    overflow-y: auto;
    line-height: 24px;
    color: #666;
  }
  .share-checked {
    padding: 15px 0px;
  }
  .share-btn {
    text-align: right;
    .pd-30 {
      padding-left: 30px;
      padding-right: 30px;
    }
  }
}
</style>
