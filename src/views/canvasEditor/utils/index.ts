import { ref } from "vue";
import { http } from "@/utils/http";
import {
  addTextDialogsubmit,
  addTableDialogsubmit,
  init,
  setcoverByTemp,
  getisDataSourceTable,
  getelementListItem
} from "./canvasEditor";
import { useRoute } from "vue-router";
export const addTextDialog: any = ref({
  type: "",
  show: false,
  show1: false,
  title: "文本控件",
  width: "450px",
  list: [],
  formatList: [],
  close: () => {},
  submit: () => {}
});
const coverDatasource = ref([]);
const textDatasource = ref([]);
const tableDatasource = ref([]);
// 获取路由参数id
export const dataText = () => {
  addTextDialog.value.close = (bool = false) => {
    addTextDialog.value.show = bool;
  };
  addTextDialog.value.submit = addTextDialogsubmit;
  addTextDialog.value.title = "文本控件";
  addTextDialog.value.type = "text";
  if (getisDataSourceTable()) {
    addTextDialog.value.type = "tableText";
    addTextDialog.value.list = dataSourceTableDialog();
    console.log("addTextDialog.value.list", addTextDialog.value.list);
  } else {
    addTextDialog.value.list = textDatasource.value;
  }
  addTextDialog.value.show = true;
  console.log(
    "🚀  file: index.vue:467  dataText   this.textDatasource:",
    addTextDialog.value
  );
};
export const dataSourceTableDialog = () => {
  const list =
    tableDatasource.value.filter(item => {
      return item.dsField === getelementListItem()?.value;
    }) || [];
  return list[0]?.datasourceFieldList || [];
};
export const dataTable = () => {
  addTextDialog.value.close = (bool = false) => {
    addTextDialog.value.show = bool;
  };
  addTextDialog.value.submit = addTableDialogsubmit;
  addTextDialog.value.title = "表格控件";
  addTextDialog.value.type = "table";
  console.log(
    "🚀  file: index.vue:467  dataTable   this.tableDatasource:",
    tableDatasource.value
  );
  addTextDialog.value.list = tableDatasource.value;
  addTextDialog.value.show = true;
};
export const getCoverDatasource = async () => {
  const res: any = await http.request("get", "templet/v1/getCoverDatasource");
  if (res.status === 200) {
    res.result &&
      res.result.forEach(item => {
        item.value = item.dsField;
        item.label = item.dsName;
        item.datasourceFieldList &&
          item.datasourceFieldList.forEach(field => {
            field.value = field.cdfField;
            field.label = field.cdfName;
            field.dsField = item.dsField;
            field.dsName = item.dsName;
            field.dsType = item.dsType;
          });
      });
    coverDatasource.value = res.result || [];
    textDatasource.value = res.result.filter(item => {
      return ~~item.dsGroup !== 3;
    });
    tableDatasource.value = res.result.filter(item => {
      return ~~item.dsGroup === 3;
    });
  }
};
export const getCoverByTempId = async (tempId = "") => {
  const params = { tempId };
  const res: any = await http.request("get", "/templet/v1/getCoverByTempId", {
    params
  });
  if (res.status === 200) {
    const placeSource = JSON.parse(res.result?.placeSource || "[]");
    const unobj: any = {
      value: "\n"
    };
    if (placeSource[0]?.rowFlex) {
      unobj.rowFlex = placeSource[0].rowFlex;
    }
    placeSource.unshift(unobj);
    init(placeSource);
    setcoverByTemp(res.result);
  }
};
export const getDateFormat = async () => {
  const res: any = await http.request("get", "/templet/v1/getDateFormat", {});
  if (res.status === 200) {
    addTextDialog.value.formatList = res.result || [];
  }
};
