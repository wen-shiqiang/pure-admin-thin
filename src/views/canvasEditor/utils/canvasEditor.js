import { ref } from "vue";
import { ElMessage } from "element-plus";
import { http } from "@/utils/http";
import Editor, {
  EditorMode,
  ElementType,
  KeyMap,
  RowFlex
} from "wsq-canvas-editor";
import { getHTMLRewrite } from "./getHtml";
import { dataText, dataTable } from "./index";
let instance = ref(null);
const editorOptions = {
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
export const tempId = ref(null);
export const elementListItem = ref({});
const coverByTemp = ref({});
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
export const saveAddOrUpdateCover = async (data = {}) => {
  const paramsData = {
    tempId: tempId.value,
    htmlContent: data.html,
    placeSource: JSON.stringify(data.value)
  };
  coverByTemp.value?.id && (paramsData.id = coverByTemp.value.id);
  const res = await http.request("post", "/templet/v1/addOrUpdateCover", {
    data: paramsData
  });
  if (res.status === 200) {
    ElMessage.success("保存成功");
    return;
  }
  ElMessage.error(res.message || "保存失败");
};
export const getContextMenuList = async instance => {
  const contextMenuList = await instance.register.getContextMenuList();
  console.log(
    "🚀  file: index.vue:2240  getContextMenuList  contextMenuList:",
    contextMenuList
  );
};
export const addTableDialogsubmit = async (data = {}, addTextDialog) => {
  const tableWidth = data?.tableWidth || 554;
  const columnsWidth = Math.round(tableWidth / data.tableColumnsNumber);
  const colgroup = [];
  const tdList = [];
  for (let index = 0; index < ~~data.tableColumnsNumber; index++) {
    colgroup.push({
      width: columnsWidth
    });
    tdList.push({
      colspan: 1,
      rowspan: 1,
      value: [{ value: ``, size: 16 }]
    });
  }
  instance.command.executeInsertElementList([
    {
      type: ElementType.TABLE,
      value: data.dataSource || "",
      colgroup: colgroup,
      trList: [
        {
          height: 40,
          tdList: tdList
        },
        {
          height: 40,
          tdList: tdList
        }
      ]
    }
  ]);
  getContextMenuList(instance);
  addTextDialog.value.show = false;
};

export const addTextDialogsubmit = (data = {}, dialogData = {}) => {
  console.log("🚀  file: canvasEditor.js:104  data:", data);

  console.log("🚀  file: canvasEditor.js:104  dialogData:", dialogData);
  if (dialogData.value.type === "tableText") {
    const list =
      dialogData.value.list.filter(
        item => item.cdfField === data.dataSource
      )[0] || {};
    console.log(
      "🚀  file: canvasEditor.js:114  addTextDialogsubmit  list:",
      list
    );
    data.dsName = list.dsName || "";
    data.cdfName = list.cdfName || "";
    data.dataSource = [list.dsField, list.cdfField] || [];
  }
  const value = `${data.dsName}.${data.cdfName}` || "";
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
        value: value
          ? [
              {
                value,
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
  const container = document.querySelector(".editor");
  instance = new Editor(
    container,
    {
      main: data || []
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
      if (!visibleDom || visibleDom.contains(evt.target)) {
        return;
      }
      visibleDom.classList.remove("visible");
    },
    {
      capture: true
    }
  );

  // 2. | 撤销 | 重做 | 格式刷 | 清除格式 |
  const undoDom = document.querySelector(".menu-item__undo");
  undoDom.title = `撤销(${isApple ? "⌘" : "Ctrl"}+Z)`;
  undoDom.onclick = () => {
    console.log("undo");
    instance.command.executeUndo();
  };

  const redoDom = document.querySelector(".menu-item__redo");
  redoDom.title = `重做(${isApple ? "⌘" : "Ctrl"}+Y)`;
  redoDom.onclick = () => {
    console.log("redo");
    instance.command.executeRedo();
  };

  const painterDom = document.querySelector(".menu-item__painter");

  let isFirstClick = true;
  let painterTimeout;
  painterDom.onclick = () => {
    if (isFirstClick) {
      isFirstClick = false;
      painterTimeout = window.setTimeout(() => {
        console.log("painter-click");
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
    console.log("painter-dblclick");
    isFirstClick = true;
    window.clearTimeout(painterTimeout);
    instance.command.executePainter({
      isDblclick: true
    });
  };

  document.querySelector(".menu-item__format").onclick = () => {
    console.log("format");
    instance.command.executeFormat();
  };

  // 3. | 字体 | 字体变大 | 字体变小 | 加粗 | 斜体 | 下划线 | 删除线 | 上标 | 下标 | 字体颜色 | 背景色 |
  const fontDom = document.querySelector(".menu-item__font");
  const fontSelectDom = fontDom.querySelector(".select");
  const fontOptionDom = fontDom.querySelector(".options");
  fontDom.onclick = () => {
    console.log("font");
    fontOptionDom.classList.toggle("visible");
  };
  fontOptionDom.onclick = evt => {
    const li = evt.target;
    instance.command.executeFont(li.dataset.family);
  };

  const sizeSetDom = document.querySelector(".menu-item__size");
  const sizeSelectDom = sizeSetDom.querySelector(".select");
  const sizeOptionDom = sizeSetDom.querySelector(".options");
  sizeSetDom.title = `设置字号`;
  sizeSetDom.onclick = () => {
    console.log("size");
    sizeOptionDom.classList.toggle("visible");
  };
  sizeOptionDom.onclick = evt => {
    const li = evt.target;
    instance.command.executeSize(li.dataset.size);
  };

  const sizeAddDom = document.querySelector(".menu-item__size-add");
  sizeAddDom.title = `增大字号(${isApple ? "⌘" : "Ctrl"}+[)`;
  sizeAddDom.onclick = () => {
    console.log("size-add");
    instance.command.executeSizeAdd();
  };

  const sizeMinusDom = document.querySelector(".menu-item__size-minus");
  sizeMinusDom.title = `减小字号(${isApple ? "⌘" : "Ctrl"}+])`;
  sizeMinusDom.onclick = () => {
    console.log("size-minus");
    instance.command.executeSizeMinus();
  };

  const boldDom = document.querySelector(".menu-item__bold");
  boldDom.title = `加粗(${isApple ? "⌘" : "Ctrl"}+B)`;
  boldDom.onclick = () => {
    console.log("bold");
    instance.command.executeBold();
  };

  const italicDom = document.querySelector(".menu-item__italic");
  italicDom.title = `斜体(${isApple ? "⌘" : "Ctrl"}+I)`;
  italicDom.onclick = () => {
    console.log("italic");
    instance.command.executeItalic();
  };

  const colorControlDom = document.querySelector("#color");
  colorControlDom.oninput = () => {
    instance.command.executeColor(colorControlDom.value);
  };
  const colorDom = document.querySelector(".menu-item__color");
  const colorSpanDom = colorDom.querySelector("span");
  colorDom.onclick = () => {
    console.log("color");
    colorControlDom.click();
  };

  const highlightControlDom = document.querySelector("#highlight");
  highlightControlDom.oninput = () => {
    instance.command.executeHighlight(highlightControlDom.value);
  };
  const highlightDom = document.querySelector(".menu-item__highlight");
  const highlightSpanDom = highlightDom.querySelector("span");
  highlightDom.onclick = () => {
    console.log("highlight");
    highlightControlDom?.click();
  };

  const titleDom = document.querySelector(".menu-item__title");
  const titleSelectDom = titleDom.querySelector(".select");
  const titleOptionDom = titleDom.querySelector(".options");
  titleOptionDom.querySelectorAll("li").forEach((li, index) => {
    li.title = `Ctrl+${isApple ? "Option" : "Alt"}+${index}`;
  });

  titleDom.onclick = () => {
    console.log("title");
    titleOptionDom.classList.toggle("visible");
  };
  titleOptionDom.onclick = evt => {
    const li = evt.target;
    const level = li.dataset.level;
    instance.command.executeTitle(level || null);
  };

  const leftDom = document.querySelector(".menu-item__left");
  leftDom.title = `左对齐(${isApple ? "⌘" : "Ctrl"}+L)`;
  leftDom.onclick = () => {
    console.log("left");
    instance.command.executeRowFlex(RowFlex.LEFT);
  };

  const centerDom = document.querySelector(".menu-item__center");
  centerDom.title = `居中对齐(${isApple ? "⌘" : "Ctrl"}+E)`;
  centerDom.onclick = () => {
    console.log("center");
    instance.command.executeRowFlex(RowFlex.CENTER);
  };

  const rightDom = document.querySelector(".menu-item__right");
  rightDom.title = `右对齐(${isApple ? "⌘" : "Ctrl"}+R)`;
  rightDom.onclick = () => {
    console.log("right");
    instance.command.executeRowFlex(RowFlex.RIGHT);
  };

  // 4. | 表格 | 图片 | 超链接 | 分割线 | 水印 | 代码块 | 分隔符 | 控件 | 复选框 | LaTeX | 日期选择器
  const tableDom = document.querySelector(".menu-item__table");
  const tablePanelContainer = document.querySelector(
    ".menu-item__table__collapse"
  );
  const tableClose = document.querySelector(".table-close");
  const tableTitle = document.querySelector(".table-select");
  const tablePanel = document.querySelector(".table-panel");
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
  const setTableTitle = payload => {
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
    console.log("table");
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

  const imageDom = document.querySelector(".menu-item__image");
  const imageFileDom = document.querySelector("#image");
  imageDom.onclick = () => {
    imageFileDom.click();
  };
  imageFileDom.onchange = () => {
    const file = imageFileDom.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      // 计算宽高
      const image = new Image();
      const value = fileReader.result;
      image.src = value;
      image.onload = () => {
        instance.command.executeImage({
          value,
          width: image.width,
          height: image.height
        });
        imageFileDom.value = "";
      };
    };
  };

  const controlDom = document.querySelector(".menu-item__control");
  const controlOptionDom = controlDom.querySelector(".options");
  controlDom.onclick = () => {
    console.log("control");
    controlOptionDom.classList.toggle("visible");
  };
  controlOptionDom.onmousedown = evt => {
    controlOptionDom.classList.toggle("visible");
    const li = evt.target;
    const type = li.dataset.control;
    switch (type) {
      case "table":
        dataTable("table");
        break;
      case "dataText":
        console.log("dataText");
        dataText("dataText");
        break;
      default:
        break;
    }
  };

  // 5. | 搜索&替换 | 打印 |

  const printDom = document.querySelector(".menu-item__print");
  printDom.title = `打印(${isApple ? "⌘" : "Ctrl"}+P)`;
  printDom.onclick = () => {
    console.log("print");
    instance.command.executePrint();
  };
  const saveDom = document.querySelector(".menu-item__save");
  saveDom.title = `保存`;
  saveDom.onclick = async () => {
    const html = getHTMLRewrite(instance)?.main || "";
    const value = instance.command.getValue()?.data?.main || "";
    console.log("value", value);
    saveAddOrUpdateCover({ html, value });
  };
  document.querySelector(".page-scale-percentage").onclick = () => {
    console.log("page-scale-recovery");
    instance.command.executePageScaleRecovery();
  };

  document.querySelector(".page-scale-minus").onclick = () => {
    console.log("page-scale-minus");
    instance.command.executePageScaleMinus();
  };

  document.querySelector(".page-scale-add").onclick = () => {
    console.log("page-scale-add");
    instance.command.executePageScaleAdd();
  };
  const toggleFullscreen = () => {
    console.log("fullscreen");
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  // 全屏
  const fullscreenDom = document.querySelector(".fullscreen");
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

  // 7. 编辑器使用模式
  const modeIndex = 0;
  const modeList = [
    {
      mode: EditorMode.EDIT,
      name: "编辑模式"
    },
    {
      mode: EditorMode.CLEAN,
      name: "清洁模式"
    },
    {
      mode: EditorMode.READONLY,
      name: "只读模式"
    },
    {
      mode: EditorMode.FORM,
      name: "表单模式"
    },
    {
      mode: EditorMode.PRINT,
      name: "打印模式"
    }
  ];
  // 8. 内部事件监听
  instance.listener.rangeStyleChange = async payload => {
    const position = await instance.draw.getPosition();
    const { draw, positionContext } = position;
    const { elementList } = draw;
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
        console.log("22222222222222222");
      }
    }
    // 富文本
    fontOptionDom
      .querySelectorAll("li")
      .forEach(li => li.classList.remove("active"));
    const curFontDom = fontOptionDom.querySelector(
      `[data-family='${payload.font}']`
    );
    if (curFontDom) {
      fontSelectDom.innerText = curFontDom.innerText;
      fontSelectDom.style.fontFamily = payload.font;
      curFontDom.classList.add("active");
    }
    sizeOptionDom
      .querySelectorAll("li")
      .forEach(li => li.classList.remove("active"));
    const curSizeDom = sizeOptionDom.querySelector(
      `[data-size='${payload.size}']`
    );
    if (curSizeDom) {
      sizeSelectDom.innerText = curSizeDom.innerText;
      curSizeDom.classList.add("active");
    } else {
      sizeSelectDom.innerText = `${payload.size}`;
    }
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
    titleOptionDom
      .querySelectorAll("li")
      .forEach(li => li.classList.remove("active"));
    if (payload.level) {
      const curTitleDom = titleOptionDom.querySelector(
        `[data-level='${payload.level}']`
      );
      titleSelectDom.innerText = curTitleDom.innerText;
      curTitleDom.classList.add("active");
    } else {
      titleSelectDom.innerText = "正文";
      titleOptionDom.querySelector("li:first-child").classList.add("active");
    }
  };

  instance.listener.pageScaleChange = payload => {
    console.log("🚀  file: canvasEditor.js:1708  init  payload:", payload);
    document.querySelector(".page-scale-percentage").innerText =
      `${Math.floor(payload * 10 * 10)}%`;
  };

  instance.listener.controlChange = payload => {
    console.log("🚀  file: canvasEditor.js:1710  init  payload:", payload);
    const disableMenusInControlContext = ["table"];
    // 菜单操作权限
    disableMenusInControlContext.forEach(menu => {
      console.log("🚀  file: canvasEditor.js:1639  init  menu:", menu);
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
