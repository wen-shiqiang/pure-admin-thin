import { ref, nextTick } from "vue";
import { http } from "@/utils/http";
import {
  addTextDialogsubmit,
  addTableDialogsubmit,
  init,
  setcoverByTemp,
  getisDataSourceTable,
  getelementListItem,
  setExecuteFont,
  setExecuteSize,
  setExecuteTitle,
  setExecuteRowMargin,
  getisTable
} from "./canvasEditor";
export const addTextDialog: any = ref({
  type: "",
  show: false,
  show1: false,
  title: "文本控件",
  width: "500px",
  list: [],
  formatList: [],
  close: () => {},
  submit: () => {}
});
const coverDatasource = ref([]);
export const showEdit = ref(true);
const textDatasource = ref([]);
const tableDatasource = ref([]);

// 字体设置开始
export const fontValue = ref("Microsoft YaHei");
export const fontOptions = [
  { name: "微软雅黑", value: "Microsoft YaHei" },
  { name: "宋体", value: "宋体" },
  { name: "仿宋", value: "仿宋" },
  { name: "楷体", value: "楷体" },
  { name: "等线", value: "等线" },
  { name: "方正小标宋GBK", value: "方正小标宋GBK" },
  { name: "华文琥珀", value: "华文琥珀" },
  { name: "华文楷体", value: "华文楷体" },
  { name: "华文隶书", value: "华文隶书" },
  { name: "华文新魏", value: "华文新魏" },
  { name: "华文行楷", value: "华文行楷" },
  { name: "华文中宋", value: "华文中宋" },
  { name: "华文彩云", value: "华文彩云" },
  { name: "Segoe UI", value: "Segoe UI" },
  { name: "Ink Free", value: "Ink Free" },
  { name: "Fantasy", value: "Fantasy" }
];
/**
 * @description: 点击文字设置下拉框选中的值
 * @param {*} val 字体
 * @return {*}
 */
export const setFontValue = (val: string = ""): any => {
  fontValue.value = val || "Microsoft YaHei";
};
/**
 * @description: 设置字体
 * @param {*} val 字体
 * @return {*}
 */
export const changeFontValue = (val: string = "Microsoft YaHei"): any => {
  setExecuteFont(val);
};
// 字体设置相关结束

// 字体设置大小开始
export const fontSizeValue = ref(16);

export const fontSizeOptions = [
  { name: "初号", value: 56 },
  { name: "小初", value: 48 },
  { name: "一号", value: 34 },
  { name: "小一", value: 32 },
  { name: "二号", value: 29 },
  { name: "小二", value: 24 },
  { name: "三号", value: 21 },
  { name: "四号", value: 18 },
  { name: "小四", value: 16 },
  { name: "五号", value: 14 },
  { name: "小五", value: 12 },
  { name: "六号", value: 10 },
  { name: "小六", value: 8 },
  { name: "七号", value: 7 },
  { name: "八号", value: 6 }
];

export const setFontSizeValue = (val: number = null): any => {
  fontSizeValue.value = val || 16;
};
export const changeFontSizeValue = (val: number = null): any => {
  setExecuteSize(val);
};
// 字体设置大小结束

// 设置标题开始
export const titleValue = ref("");
export const titleValueOptions = [
  { name: "正文", value: "" },
  { name: "标题1", value: "first" },
  { name: "标题2", value: "second" },
  { name: "标题3", value: "third" },
  { name: "标题4", value: "fourth" },
  { name: "标题5", value: "fifth" },
  { name: "标题6", value: "sixth" }
];
export const setTitleValue = (val: string = null): any => {
  titleValue.value = val;
};
export const changeTitleValue = (val: string = null): any => {
  setExecuteTitle(val);
};
// 设置标题结束

//设置行间距开始

export const lineHeightValue = ref(1);
export const lineHeightValueOptions = [
  { name: "1", value: 1 },
  { name: "1.25", value: 1.25 },
  { name: "1.5", value: 1.5 },
  { name: "1.75", value: 1.75 },
  { name: "2", value: 2 },
  { name: "2.5", value: 2.5 },
  { name: "3", value: 3 },
  { name: "3.5", value: 3.5 },
  { name: "4", value: 4 },
  { name: "4.5", value: 4.5 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 }
];
export const setLineHeightValue = (val: number = 1): any => {
  lineHeightValue.value = val;
};
export const changeLineHeightValue = (val: number = 1): any => {
  setExecuteRowMargin(val);
};
//设置行间距结束

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
  } else {
    if (getisTable()) {
      addTextDialog.value.list = textDatasource.value.filter(e => {
        return e.dsType !== 4;
      });
    } else {
      addTextDialog.value.list = textDatasource.value;
    }
  }
  addTextDialog.value.show = true;
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
  tableDatasource.value.forEach(item => {
    item.disabled = false;
  });
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
      item.disabled = false;
      return ~~item.dsGroup === 3;
    });
  }
};
export const getCoverByTempId = async (tempId = "", num = 0) => {
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
    setcoverByTemp(res.result);
    if (num) {
      showEdit.value = false;
      setTimeout(() => {
        showEdit.value = true;
        nextTick(() => {
          init(placeSource);
        });
      }, 0);
      return;
    }
    init(placeSource);
  }
};
export const getDateFormat = async () => {
  const res: any = await http.request("get", "/templet/v1/getDateFormat", {});
  if (res.status === 200) {
    addTextDialog.value.formatList = res.result || [];
  }
};
