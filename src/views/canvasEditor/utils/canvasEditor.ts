import { ref } from "vue";
import { ElMessage } from "element-plus";
import { http } from "@/utils/http";
import Editor, {
  ElementType,
  KeyMap,
  RowFlex,
  type IElement,
  type TitleLevel
  // } from "wsq-canvas-editor";
} from "../editor/index";
import { getHTMLRewrite } from "./getHtml";
import {
  getCoverByTempId,
  setFontValue,
  setFontSizeValue,
  setTitleValue
} from "./index";
let instance: any = ref(null);
const editorOptions: any = {
  margins: [100, 120, 100, 120],
  watermark: {
    data: "CANVAS-EDITOR",
    size: 120
  },
  pageNumber: {
    disabled: true,
    format: "第{pageNo}页/共{pageCount}页"
  },
  placeholder: {
    data: "请输入内容..."
  },
  zone: {
    tipDisabled: false
  },
  footer: {
    disabled: true
  },
  header: {
    disabled: true
  },
  maskMargin: [60, 0, 30, 0], // 菜单栏高度60，底部工具栏30为遮盖层
  pageMode: "continuity"
};
export const isDataSourceTable = ref(false);
export const isTable = ref(false);
export const tempId: any = ref(null);
export const elementListItem = ref({});
const coverByTemp: any = ref({});
export const setcoverByTemp = (data = {}) => {
  coverByTemp.value = data;
};
export const setTempId = (id = {}) => {
  tempId.value = id;
};
export const getelementListItem = () => {
  return elementListItem.value;
};
export const getisDataSourceTable = () => {
  return isDataSourceTable.value;
};
// 设置字体
export const setExecuteFont = (val = "") => {
  instance.command.executeFont(val || "Microsoft YaHei");
};
// 设置字体
export const setExecuteSize = (val = null) => {
  instance.command.executeSize(val || 16);
};
// 设置标题
export const setExecuteTitle = (val = null) => {
  instance.command.executeTitle(val || null);
};
export const saveAdd = async (num = 0) => {
  const html = getHTMLRewrite(instance)?.main || "";
  const value = instance.command.getValue()?.data?.main || "";
  saveAddOrUpdateCover({ html, value, num });
};
export const reset = async () => {
  initDateFormat();
};
export const initDateFormat = async () => {
  const params = { tempId: tempId.value };
  const res: any = await http.request("get", "/templet/v1/initDateFormat", {
    params
  });
  if (res.status === 200) {
    ElMessage.success("操作成功");
    getCoverByTempId(tempId.value, 1);
    return;
  }
  ElMessage.error(res.message || "保存失败");
};
export const saveAddOrUpdateCover = async (data: any = {}) => {
  const paramsData: any = {
    tempId: tempId.value,
    htmlContent: data.html,
    placeSource: JSON.stringify(data.value)
  };
  coverByTemp.value?.id && (paramsData.id = coverByTemp.value.id);
  const res: any = await http.request("post", "/templet/v1/addOrUpdateCover", {
    data: paramsData
  });
  if (res.status === 200) {
    ElMessage.success("保存成功");
    if (data.num === 1) {
      window?.parent?.postMessage("save-confirmation", "*");
    }
    return;
  }
  ElMessage.error(res.message || "保存失败");
};
export const getContextMenuList = async instance => {
  const contextMenuList = await instance.register.getContextMenuList();
};
export const addTableDialogsubmit = async (
  data: any = {},
  addTextDialog: any
) => {
  console.log(data);
  console.log(addTextDialog.value.list);
  const tableWidth = data?.tableWidth || 554;
  const columnsWidth = Math.round(tableWidth / data.tableDataSource.length);
  const tableDataSource1 = data.tableDataSource.map(item => item[1]);
  const list =
    addTextDialog.value.list.filter(
      item => item.dsField === data.tableDataSource[0][0]
    )[0] || {};
  const list1 = list.datasourceFieldList.filter(item =>
    tableDataSource1.includes(item.cdfField)
  );
  console.log(list1);
  const colgroup = [];
  const tdList = [];
  const tdList1 = [];
  for (let index = 0; index < list1.length; index++) {
    colgroup.push({
      width: columnsWidth
    });
    tdList.push({
      colspan: 1,
      rowspan: 1,
      value: [{ value: `${list1[index].cdfName}`, size: 16, rowFlex: "center" }]
    });
    tdList1.push({
      colspan: 1,
      rowspan: 1,
      value: [
        { value: ``, size: 16, rowFlex: "center" },
        {
          value: "",
          type: "control",
          rowFlex: "center",
          control: {
            type: "text",
            dataSource: [list1[index].dsField, list1[index].cdfField],
            dsType: "",
            dataType: "",
            value: [
              {
                value: `${list1[index].dsName}.${list1[index].cdfName}`,
                type: "text",
                color: "#999998"
              }
            ],
            placeholder: `${list1[index].dsName}.${list1[index].cdfName}`
          }
        }
      ]
    });
  }
  instance.command.executeInsertElementList([
    {
      type: ElementType.TABLE,
      value: data.tableDataSource[0][0] || "",
      colgroup: colgroup,
      rowFlex: RowFlex.CENTER,
      trList: [
        {
          height: 40,
          tdList: tdList
        },
        {
          height: 40,
          tdList: tdList1
        }
      ]
    }
  ]);
  getContextMenuList(instance);
  addTextDialog.value.show = false;
};

export const addTextDialogsubmit = (data: any = {}, dialogData: any = {}) => {
  if (dialogData.value.type === "tableText") {
    const list =
      dialogData.value.list.filter(
        item => item.cdfField === data.dataSource
      )[0] || {};
    data.dsName = list.dsName || "";
    data.cdfName = list.cdfName || "";
    data.dataSource = [list.dsField, list.cdfField] || [];
  }
  let placeholder = `${data.dsName}.${data.cdfName}` || "";
  const type = data.type || "text";
  let formatItem = null;
  if (data.dsType == 5) {
    formatItem =
      dialogData.value.formatList.find(item => item.id == data.formatType) ||
      "";
    formatItem.formatName && (placeholder += ` (${formatItem.formatName})`);
  }
  const list = [
    {
      type: ElementType.CONTROL,
      value: data.dataSource || "",
      dataSource: data.dataSource || "",
      conceptId: data?.conceptId || Date.now(),
      control: {
        type,
        dataSource: data.dataSource || "",
        dsType: data.dsType || "",
        dataType: formatItem?.id || "",
        value: placeholder
          ? [
              {
                value: placeholder,
                type: "text",
                color: "#999998"
              }
            ]
          : null,
        placeholder
      }
    }
  ];
  executeInsertElementList(list);
  dialogData.value.show = false;
};

export const executeInsertElementList = payload => {
  instance.command.executeInsertElementList(payload);
};

export const init = async (data = []) => {
  const isApple =
    typeof navigator !== "undefined" && /Mac OS X/.test(navigator.userAgent);
  // 1. 初始化编辑器
  const container = document.querySelector<HTMLDivElement>(".editor")!;
  instance = new Editor(
    container,
    {
      main: <IElement[]>data || []
    },
    editorOptions
  );
  instance.command.executeDeleteWatermark();
  // cypress使用
  Reflect.set(window, "editor", instance);

  // 菜单弹窗销毁
  window.addEventListener(
    "click",
    evt => {
      const visibleDom = document.querySelector(".visible");
      if (!visibleDom || visibleDom.contains(<Node>evt.target)) {
        return;
      }
      visibleDom.classList.remove("visible");
    },
    {
      capture: true
    }
  );

  // 2. | 撤销 | 重做 | 格式刷 | 清除格式 |
  const undoDom = document.querySelector<HTMLDivElement>(".menu-item__undo")!;
  undoDom.title = `撤销(${isApple ? "⌘" : "Ctrl"}+Z)`;
  undoDom.onclick = () => {
    instance.command.executeUndo();
  };

  const redoDom = document.querySelector<HTMLDivElement>(".menu-item__redo")!;
  redoDom.title = `重做(${isApple ? "⌘" : "Ctrl"}+Y)`;
  redoDom.onclick = () => {
    instance.command.executeRedo();
  };

  const painterDom = document.querySelector<HTMLDivElement>(
    ".menu-item__painter"
  )!;

  let isFirstClick = true;
  let painterTimeout;
  painterDom.onclick = () => {
    if (isFirstClick) {
      isFirstClick = false;
      painterTimeout = window.setTimeout(() => {
        isFirstClick = true;
        instance.command.executePainter({
          isDblclick: false
        });
      }, 200);
    } else {
      window.clearTimeout(painterTimeout);
    }
  };

  painterDom.ondblclick = () => {
    isFirstClick = true;
    window.clearTimeout(painterTimeout);
    instance.command.executePainter({
      isDblclick: true
    });
  };

  document.querySelector<HTMLDivElement>(".menu-item__format")!.onclick =
    () => {
      instance.command.executeFormat();
    };

  // 3. | 字体 | 字体变大 | 字体变小 | 加粗 | 斜体 | 下划线 | 删除线 | 上标 | 下标 | 字体颜色 | 背景色 |

  const sizeAddDom = document.querySelector<HTMLDivElement>(
    ".menu-item__size-add"
  )!;
  sizeAddDom.title = `增大字号(${isApple ? "⌘" : "Ctrl"}+[)`;
  sizeAddDom.onclick = () => {
    instance.command.executeSizeAdd();
  };

  const sizeMinusDom = document.querySelector<HTMLDivElement>(
    ".menu-item__size-minus"
  )!;
  sizeMinusDom.title = `减小字号(${isApple ? "⌘" : "Ctrl"}+])`;
  sizeMinusDom.onclick = () => {
    instance.command.executeSizeMinus();
  };

  const boldDom = document.querySelector<HTMLDivElement>(".menu-item__bold")!;
  boldDom.title = `加粗(${isApple ? "⌘" : "Ctrl"}+B)`;
  boldDom.onclick = () => {
    instance.command.executeBold();
  };

  const italicDom =
    document.querySelector<HTMLDivElement>(".menu-item__italic")!;
  italicDom.title = `斜体(${isApple ? "⌘" : "Ctrl"}+I)`;
  italicDom.onclick = () => {
    instance.command.executeItalic();
  };

  const underlineDom = document.querySelector<HTMLDivElement>(
    ".menu-item__underline"
  )!;
  underlineDom.title = `下划线(${isApple ? "⌘" : "Ctrl"}+U)`;
  const underlineOptionDom =
    underlineDom.querySelector<HTMLDivElement>(".options")!;
  underlineDom.querySelector<HTMLSpanElement>(".select")!.onclick =
    function () {
      underlineOptionDom.classList.toggle("visible");
    };
  underlineDom.querySelector("i").onclick = function () {
    instance.command.executeUnderline();
    underlineOptionDom.classList.remove("visible");
  };
  underlineDom.querySelector<HTMLUListElement>("ul").onmousedown = function (
    evt
  ) {
    const li = evt.target as HTMLLIElement;
    const decorationStyle = li.dataset.decorationStyle;
    instance.command.executeUnderline({
      style: decorationStyle
    });
    underlineOptionDom.classList.remove("visible");
  };
  const strikeoutDom = document.querySelector<HTMLDivElement>(
    ".menu-item__strikeout"
  )!;
  strikeoutDom.onclick = function () {
    instance.command.executeStrikeout();
  };
  const colorControlDom = document.querySelector<HTMLInputElement>("#color")!;
  colorControlDom.oninput = () => {
    instance.command.executeColor(colorControlDom.value);
  };
  const colorDom = document.querySelector<HTMLDivElement>(".menu-item__color")!;
  const colorSpanDom = colorDom.querySelector("span")!;
  colorDom.onclick = () => {
    colorControlDom.click();
  };

  const highlightControlDom =
    document.querySelector<HTMLInputElement>("#highlight")!;
  highlightControlDom.oninput = () => {
    instance.command.executeHighlight(highlightControlDom.value);
  };
  const highlightDom = document.querySelector<HTMLDivElement>(
    ".menu-item__highlight"
  )!;
  const highlightSpanDom = highlightDom.querySelector("span");
  highlightDom.onclick = () => {
    highlightControlDom?.click();
  };

  const leftDom = document.querySelector<HTMLDivElement>(".menu-item__left")!;
  leftDom.title = `左对齐(${isApple ? "⌘" : "Ctrl"}+L)`;
  leftDom.onclick = () => {
    instance.command.executeRowFlex(RowFlex.LEFT);
  };

  const centerDom =
    document.querySelector<HTMLDivElement>(".menu-item__center")!;
  centerDom.title = `居中对齐(${isApple ? "⌘" : "Ctrl"}+E)`;
  centerDom.onclick = () => {
    instance.command.executeRowFlex(RowFlex.CENTER);
  };

  const rightDom = document.querySelector<HTMLDivElement>(".menu-item__right")!;
  rightDom.title = `右对齐(${isApple ? "⌘" : "Ctrl"}+R)`;
  rightDom.onclick = () => {
    instance.command.executeRowFlex(RowFlex.RIGHT);
  };

  // 4. | 表格 | 图片 | 超链接 | 分割线 | 水印 | 代码块 | 分隔符 | 控件 | 复选框 | LaTeX | 日期选择器
  const tableDom = document.querySelector<HTMLDivElement>(".menu-item__table")!;
  const tablePanelContainer = document.querySelector<HTMLDivElement>(
    ".menu-item__table__collapse"
  )!;
  const tableClose = document.querySelector<HTMLDivElement>(".table-close")!;
  const tableTitle = document.querySelector<HTMLDivElement>(".table-select")!;
  const tablePanel = document.querySelector<HTMLDivElement>(".table-panel")!;
  // 绘制行列
  const tableCellList = [];
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement("tr");
    tr.classList.add("table-row");
    const trCellList = [];
    for (let j = 0; j < 10; j++) {
      const td = document.createElement("td");
      td.classList.add("table-cel");
      tr.append(td);
      trCellList.push(td);
    }
    tablePanel.append(tr);
    tableCellList.push(trCellList);
  }
  let colIndex = 0;
  let rowIndex = 0;
  // 移除所有格选择
  const removeAllTableCellSelect = () => {
    tableCellList.forEach(tr => {
      tr.forEach(td => td.classList.remove("active"));
    });
  };
  // 设置标题内容
  const setTableTitle = (payload: string) => {
    tableTitle.innerText = payload;
  };
  // 恢复初始状态
  const recoveryTable = () => {
    // 还原选择样式、标题、选择行列
    removeAllTableCellSelect();
    setTableTitle("插入");
    colIndex = 0;
    rowIndex = 0;
    // 隐藏panel
    tablePanelContainer.style.display = "none";
  };
  tableDom.onclick = () => {
    tablePanelContainer.style.display = "block";
  };
  tablePanel.onmousemove = evt => {
    const celSize = 16;
    const rowMarginTop = 10;
    const celMarginRight = 6;
    const { offsetX, offsetY } = evt;
    // 移除所有选择
    removeAllTableCellSelect();
    colIndex = Math.ceil(offsetX / (celSize + celMarginRight)) || 1;
    rowIndex = Math.ceil(offsetY / (celSize + rowMarginTop)) || 1;
    // 改变选择样式
    tableCellList.forEach((tr, trIndex) => {
      tr.forEach((td, tdIndex) => {
        if (tdIndex < colIndex && trIndex < rowIndex) {
          td.classList.add("active");
        }
      });
    });
    // 改变表格标题
    setTableTitle(`${rowIndex}×${colIndex}`);
  };
  tableClose.onclick = () => {
    recoveryTable();
  };
  tablePanel.onclick = () => {
    // 应用选择
    instance.command.executeInsertTable(rowIndex, colIndex);
    recoveryTable();
  };

  const imageDom = document.querySelector<HTMLDivElement>(".menu-item__image")!;
  const imageFileDom = document.querySelector<HTMLInputElement>("#image")!;
  imageDom.onclick = () => {
    imageFileDom.click();
  };
  imageFileDom.onchange = function () {
    const file = imageFileDom.files![0]!;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      // 计算宽高
      const image = new Image();
      const value = fileReader.result as string;
      image.src = value;
      image.onload = function () {
        instance.command.executeImage({
          value,
          width: image.width,
          height: image.height
        });
        imageFileDom.value = "";
      };
    };
  };

  // 5. | 搜索&替换 | 打印 |
  const saveDom = document.querySelector<HTMLDivElement>(".menu-item__save");
  saveDom.title = `保存`;
  saveDom.onclick = async () => {
    saveAdd();
  };
  const resetDom = document.querySelector<HTMLDivElement>(".menu-item__reset");
  resetDom.title = `恢复默认`;
  resetDom.onclick = async () => {
    reset();
  };
  document.querySelector<HTMLDivElement>(".page-scale-percentage")!.onclick =
    () => {
      instance.command.executePageScaleRecovery();
    };

  document.querySelector<HTMLDivElement>(".page-scale-minus")!.onclick = () => {
    instance.command.executePageScaleMinus();
  };

  document.querySelector<HTMLDivElement>(".page-scale-add")!.onclick = () => {
    instance.command.executePageScaleAdd();
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  // 全屏
  const fullscreenDom = document.querySelector<HTMLDivElement>(".fullscreen")!;
  fullscreenDom.onclick = toggleFullscreen;
  window.addEventListener("keydown", evt => {
    if (evt.key === "F11") {
      toggleFullscreen();
      evt.preventDefault();
    }
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenDom.classList.toggle("exist");
  });

  // 8. 内部事件监听
  instance.listener.rangeStyleChange = async payload => {
    const position = await instance.draw.getPosition();
    const { draw, positionContext } = position;
    const { elementList } = draw;
    const menuDom = document.querySelector(`.menu-item__image`);
    const tableDom = document.querySelector(`.data-table`);
    const textDom = document.querySelector(`.data-text`);
    if (positionContext.isTable) {
      menuDom.classList.add("disable");
      tableDom.classList.add("disable");
      textDom.classList.remove("disable");
      if (!positionContext.trIndex) {
        textDom.classList.add("disable");
      } else {
        textDom.classList.remove("disable");
      }
    } else {
      menuDom.classList.remove("disable");
      tableDom.classList.remove("disable");
      textDom.classList.remove("disable");
      if (
        positionContext.isControl &&
        elementList[positionContext.index]?.value !== "}"
      ) {
        menuDom.classList.add("disable");
        tableDom.classList.add("disable");
        textDom.classList.add("disable");
      }
    }
    if (positionContext.index) {
      if (positionContext.isTable && elementList[positionContext.index]) {
        // 表格选中
        isTable.value = elementList.isTable;
        elementListItem.value = elementList[positionContext.index];
        if (elementList[positionContext.index].value) {
          isDataSourceTable.value = true;
        }
      } else {
        isDataSourceTable.value = false;
        isTable.value = false;
        elementListItem.value = {};
      }
    }
    setFontValue(payload.font);
    setFontSizeValue(payload.size);
    payload.bold
      ? boldDom.classList.add("active")
      : boldDom.classList.remove("active");
    payload.italic
      ? italicDom.classList.add("active")
      : italicDom.classList.remove("active");
    if (payload.color) {
      colorDom.classList.add("active");
      colorControlDom.value = payload.color;
      colorSpanDom.style.backgroundColor = payload.color;
    } else {
      colorDom.classList.remove("active");
      colorControlDom.value = "#000000";
      colorSpanDom.style.backgroundColor = "#000000";
    }
    if (payload.highlight) {
      highlightDom.classList.add("active");
      highlightControlDom.value = payload.highlight;
      highlightSpanDom.style.backgroundColor = payload.highlight;
    } else {
      highlightDom.classList.remove("active");
      highlightControlDom.value = "#ffff00";
      highlightSpanDom.style.backgroundColor = "#ffff00";
    }

    // 行布局
    leftDom.classList.remove("active");
    centerDom.classList.remove("active");
    rightDom.classList.remove("active");
    if (payload.rowFlex && payload.rowFlex === "right") {
      rightDom.classList.add("active");
    } else if (payload.rowFlex && payload.rowFlex === "center") {
      centerDom.classList.add("active");
    } else if (payload.rowFlex && payload.rowFlex === "alignment") {
      // alignmentDom.classList.add('active');
    } else if (payload.rowFlex && payload.rowFlex === "justify") {
      // justifyDom.classList.add('active');
    } else {
      leftDom.classList.add("active");
    }

    // 功能
    payload.undo
      ? undoDom.classList.remove("no-allow")
      : undoDom.classList.add("no-allow");
    payload.redo
      ? redoDom.classList.remove("no-allow")
      : redoDom.classList.add("no-allow");
    payload.painter
      ? painterDom.classList.add("active")
      : painterDom.classList.remove("active");

    // 标题
    setTitleValue(payload.level || "");
  };

  instance.listener.pageScaleChange = payload => {
    document.querySelector<HTMLSpanElement>(
      ".page-scale-percentage"
    )!.innerText = `${Math.floor(payload * 10 * 10)}%`;
  };

  instance.listener.controlChange = payload => {
    const disableMenusInControlContext = ["table"];
    // 菜单操作权限
    disableMenusInControlContext.forEach(menu => {
      const menuDom = document.querySelector(`.menu-item__${menu}`);
      payload
        ? menuDom.classList.add("disable")
        : menuDom.classList.remove("disable");
    });
  };

  instance.listener.saved = payload => {
    console.log("elementList: ", payload);
  };

  // 9. 右键菜单注册
  instance.register.contextMenuList([
    {
      name: "格式整理",
      icon: "word-tool",
      when: async payload => {
        return !payload.isReadonly;
      },
      callback: command => {
        command.executeWordTool();
      }
    }
  ]);

  // 10. 快捷键注册
  instance.register.shortcutList([
    {
      key: KeyMap.P,
      mod: true,
      isGlobal: true,
      callback: command => {
        command.executePrint();
      }
    },
    {
      key: KeyMap.MINUS,
      ctrl: true,
      isGlobal: true,
      callback: command => {
        command.executePageScaleMinus();
      }
    },
    {
      key: KeyMap.EQUAL,
      ctrl: true,
      isGlobal: true,
      callback: command => {
        command.executePageScaleAdd();
      }
    },
    {
      key: KeyMap.ZERO,
      ctrl: true,
      isGlobal: true,
      callback: command => {
        command.executePageScaleRecovery();
      }
    }
  ]);
};
