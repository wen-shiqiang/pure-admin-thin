<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from "vue";
import { addTextDialog } from "../utils/index";
console.log(addTextDialog.value);
let dialog = ref(addTextDialog.value);
const ruleForm = reactive({
  dataSource: "",
  tableDataSource: [],
  dsType: null,
  tableColumnsNumber: 1,
  formatType: "",
  defaultValue: "",
  dsName: "",
  cdfName: ""
});
watch(
  () => addTextDialog.value.show,
  val => {
    console.log("🚀  file: addText.vue:21  query:", val);
    if (val) {
      ruleForm.dataSource = "";
      ruleForm.tableDataSource = [];
      ruleForm.dsType = null;
      ruleForm.tableColumnsNumber = 1;
      ruleForm.formatType = "";
      ruleForm.defaultValue = "";
      ruleForm.dsName = "";
      ruleForm.cdfName = "";
    }
  },
  { deep: true }
);

const cascaderDataSource = ref();
const ruleFormRef = ref();
const rules = reactive({
  dataSource: [
    { required: true, message: "请选择数据源", trigger: ["blur", "change"] }
  ],
  tableDataSource: [
    { required: true, message: "请选择数据源", trigger: ["blur", "change"] }
  ],
  formatType: [
    { required: true, message: "请选择格式", trigger: ["blur", "change"] }
  ],
  tableColumnsNumber: [
    { required: true, message: "请输入表格列数", trigger: ["blur", "change"] }
  ]
});
const handleChange = value => {
  console.log(value);
  const nodes = cascaderDataSource.value.getCheckedNodes() || [];
  ruleForm.dsName = nodes[0].data.dsName || "";
  ruleForm.cdfName = nodes[0].data.cdfName || "";
  ruleForm.dsType = nodes[0].data.dsType || null;
};
const handleTableChange = value => {
  if (!value.length) {
    dialog.value.list.forEach(item => {
      item.disabled = false;
    });
    return;
  }
  if (value[0]) {
    dialog.value.list.forEach(item => {
      console.log(item.value, value[0]);
      if (item.value === value[0][0]) {
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    });
  }
};
const confirmEditPlate = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      addTextDialog.value.submit(ruleForm, dialog);
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};
const dialogClose = () => {
  addTextDialog.value.close();
};
console.log("🚀  file: addText.vue:21  dialog:", dialog);
</script>

<template>
  <div class="addTextDialog-box">
    <!--模块设置弹框 -->
    <el-dialog
      v-model="dialog.show"
      :title="dialog.title"
      :close-on-click-modal="false"
      :width="dialog.width"
      :modal="false"
      custom-class="csg-dialog addPlateDialog addDirectorDialog addTextDialog"
      :before-close="dialogClose"
      destroy-on-close
    >
      <div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            v-if="dialog.type === 'text'"
            label="数据源："
            prop="dataSource"
          >
            <el-cascader
              ref="cascaderDataSource"
              v-model="ruleForm.dataSource"
              class="w-full"
              :options="dialog.list"
              :props="{
                value: 'value',
                label: 'label',
                children: 'datasourceFieldList'
              }"
              filterable
              popper-class="cascader-pop"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item
            v-if="dialog.type === 'table'"
            label="数据源："
            prop="tableDataSource"
          >
            <el-cascader
              ref="cascaderDataSource"
              v-model="ruleForm.tableDataSource"
              class="w-full"
              :options="dialog.list"
              :props="{
                multiple: true,
                value: 'value',
                label: 'label',
                children: 'datasourceFieldList'
              }"
              filterable
              popper-class="cascader-pop"
              @change="handleTableChange"
            />
          </el-form-item>
          <el-form-item
            v-if="dialog.type === 'tableText'"
            label="数据源："
            prop="dataSource"
          >
            <el-select
              v-model="ruleForm.dataSource"
              class="w-full"
              placeholder="请选择数据源"
            >
              <el-option
                v-for="item in dialog.list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            v-if="dialog.type === 'table'"
            label="表格列数："
            prop="tableColumnsNumber"
          >
            <el-input-number
              v-model="ruleForm.tableColumnsNumber"
              class="!w-full"
              :min="1"
              :max="10"
            />
          </el-form-item> -->

          <el-form-item
            v-if="ruleForm.dsType == 5"
            label="格式："
            prop="formatType"
          >
            <el-select
              v-model="ruleForm.formatType"
              class="w-full"
              placeholder="请选择格式"
            >
              <el-option
                v-for="item in dialog.formatList"
                :key="item.id"
                :label="item.formatName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="dialogClose()">取 消</el-button>
          <el-button
            class="sure-btn"
            type="primary"
            @click="confirmEditPlate(ruleFormRef)"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" type="text/less">
.cascader-pop {
  .el-cascader-menu__wrap {
    min-height: 230px;
  }
}
</style>
