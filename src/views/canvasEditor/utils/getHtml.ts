import {
  ElementType,
  RowFlex,
  TableBorder,
  TdBorder,
  type IElement,
  type IEditorOption
  // } from "wsq-canvas-editor";
} from "../editor/index";
import { NON_BREAKING_SPACE, ZERO } from "../editor/dataset/constant/Common";
import {
  CONTROL_STYLE_ATTR,
  TEXTLIKE_ELEMENT_TYPE,
  TABLE_TD_ZIP_ATTR,
  EDITOR_ROW_ATTR
} from "../editor/dataset/constant/Element";
import {
  listStyleCSSMapping,
  listTypeElementMapping
} from "../editor/dataset/constant/List";
import { titleOrderNumberMapping } from "../editor/dataset/constant/Title";
import type { DeepRequired } from "../editor/interface/Common";
import type { ITd } from "../editor/interface/table/Td";
import type { IControlSelect } from "../editor/interface/Control";
import { ControlComponent } from "../editor/dataset/enum/Control";
import {
  getIsBlockElement,
  convertRowFlexToTextAlign,
  convertRowFlexToJustifyContent,
  convertElementToDom,
  splitListElement,
  groupElementListByRowFlex,
  isSameElementExceptValue
} from "../editor/utils/element";
import { deepClone, pickObject } from "../editor/utils/";
export const EDITOR_ELEMENT_ZIP_ATTR = [
  "type",
  "font",
  "size",
  "bold",
  "color",
  "italic",
  "highlight",
  "underline",
  "strikeout",
  "rowFlex",
  "rowMargin",
  "dashArray",
  "trList",
  "borderType",
  "width",
  "height",
  "url",
  "colgroup",
  "valueList",
  "control",
  "checkbox",
  "radio",
  "dateFormat",
  "block",
  "level",
  "title",
  "listType",
  "listStyle",
  "listWrap",
  "groupIds",
  "conceptId",
  "imgDisplay",
  "imgFloatPosition",
  "textDecoration",
  "extension",
  "externalId",
  "id",
  "dataSource",
  "positionList",
  "rowIndex"
];
export function pickElementAttr(payload: IElement): IElement {
  const element: IElement = {
    value: payload.value === ZERO ? `\n` : payload.value
  };
  EDITOR_ELEMENT_ZIP_ATTR.forEach(attr => {
    const value = payload[attr] as never;
    if (value !== undefined) {
      element[attr] = value;
    }
  });
  return element;
}
export function zipElementList(payload: IElement[]): IElement[] {
  const elementList = deepClone(payload);
  const zipElementListData: IElement[] = [];
  let e = 0;
  while (e < elementList.length) {
    let element = elementList[e];
    // 上下文首字符（占位符）-列表首字符要保留避免是复选框
    if (
      e === 0 &&
      element.value === ZERO &&
      !element.listId &&
      (!element.type || element.type === ElementType.TEXT)
    ) {
      e++;
      continue;
    }
    // 优先处理虚拟元素，后表格、超链接、日期、控件特殊处理
    if (element.titleId && element.level) {
      // 标题处理
      const titleId = element.titleId;
      if (titleId) {
        const level = element.level;
        const titleElement: IElement = {
          type: ElementType.TITLE,
          title: element.title,
          value: "",
          level
        };
        const valueList: IElement[] = [];
        while (e < elementList.length) {
          const titleE = elementList[e];
          if (titleId !== titleE.titleId) {
            e--;
            break;
          }
          delete titleE.level;
          delete titleE.title;
          valueList.push(titleE);
          e++;
        }
        titleElement.valueList = zipElementList(valueList);
        element = titleElement;
      }
    } else if (element.listId && element.listType) {
      // 列表处理
      const listId = element.listId;
      if (listId) {
        const listType = element.listType;
        const listStyle = element.listStyle;
        const listElement: IElement = {
          type: ElementType.LIST,
          value: "",
          listId,
          listType,
          listStyle
        };
        const valueList: IElement[] = [];
        while (e < elementList.length) {
          const listE = elementList[e];
          if (listId !== listE.listId) {
            e--;
            break;
          }
          delete listE.listType;
          delete listE.listStyle;
          valueList.push(listE);
          e++;
        }
        listElement.valueList = zipElementList(valueList);
        element = listElement;
      }
    } else if (element.type === ElementType.TABLE) {
      // 分页表格先进行合并
      if (element.pagingId) {
        let tableIndex = e + 1;
        let combineCount = 0;
        while (tableIndex < elementList.length) {
          const nextElement = elementList[tableIndex];
          if (nextElement.pagingId === element.pagingId) {
            element.height! += nextElement.height!;
            element.trList!.push(...nextElement.trList!);
            tableIndex++;
            combineCount++;
          } else {
            break;
          }
        }
        e += combineCount;
      }
      if (element.trList) {
        for (let t = 0; t < element.trList.length; t++) {
          const tr = element.trList[t];
          delete tr.id;
          for (let d = 0; d < tr.tdList.length; d++) {
            const td = tr.tdList[d];
            const zipTd: ITd = {
              colspan: td.colspan,
              rowspan: td.rowspan,
              value: zipElementList(td.value)
            };
            // 压缩单元格属性
            TABLE_TD_ZIP_ATTR.forEach(attr => {
              const value = td[attr] as never;
              if (value !== undefined) {
                zipTd[attr] = value;
              }
            });
            tr.tdList[d] = zipTd;
          }
        }
      }
    } else if (element.type === ElementType.HYPERLINK) {
      // 超链接处理
      const hyperlinkId = element.hyperlinkId;
      if (hyperlinkId) {
        const hyperlinkElement: IElement = {
          type: ElementType.HYPERLINK,
          value: "",
          url: element.url
        };
        const valueList: IElement[] = [];
        while (e < elementList.length) {
          const hyperlinkE = elementList[e];
          if (hyperlinkId !== hyperlinkE.hyperlinkId) {
            e--;
            break;
          }
          delete hyperlinkE.type;
          delete hyperlinkE.url;
          valueList.push(hyperlinkE);
          e++;
        }
        hyperlinkElement.valueList = zipElementList(valueList);
        element = hyperlinkElement;
      }
    } else if (element.type === ElementType.DATE) {
      const dateId = element.dateId;
      if (dateId) {
        const dateElement: IElement = {
          type: ElementType.DATE,
          value: "",
          dateFormat: element.dateFormat
        };
        const valueList: IElement[] = [];
        while (e < elementList.length) {
          const dateE = elementList[e];
          if (dateId !== dateE.dateId) {
            e--;
            break;
          }
          delete dateE.type;
          delete dateE.dateFormat;
          valueList.push(dateE);
          e++;
        }
        dateElement.valueList = zipElementList(valueList);
        element = dateElement;
      }
    } else if (element.controlId) {
      // 控件处理
      const controlId = element.controlId;
      if (controlId) {
        // 以前缀为基准更新控件默认样式
        const controlDefaultStyle = <IControlSelect>(
          (<unknown>pickObject(element, CONTROL_STYLE_ATTR))
        );
        const control = {
          ...element.control!,
          ...controlDefaultStyle
        };
        const controlElement: IElement = {
          ...pickObject(element, EDITOR_ROW_ATTR),
          type: ElementType.CONTROL,
          value: "",
          control
        };
        const valueList: IElement[] = [];
        while (e < elementList.length) {
          const controlE = elementList[e];
          if (controlId !== controlE.controlId) {
            e--;
            break;
          }
          if (controlE.controlComponent === ControlComponent.VALUE) {
            delete controlE.control;
            delete controlE.controlId;
            valueList.push(controlE);
          }
          e++;
        }
        controlElement.control!.value = zipElementList(valueList);
        element = controlElement;
      }
    }
    // 组合元素
    const pickElement = pickElementAttr(element);
    if (
      !element.type ||
      element.type === ElementType.TEXT ||
      element.type === ElementType.SUBSCRIPT ||
      element.type === ElementType.SUPERSCRIPT
    ) {
      while (e < elementList.length) {
        const nextElement = elementList[e + 1];
        e++;
        if (
          nextElement &&
          isSameElementExceptValue(pickElement, pickElementAttr(nextElement))
        ) {
          const nextValue =
            nextElement.value === ZERO ? "\n" : nextElement.value;
          pickElement.value += nextValue;
        } else {
          break;
        }
      }
    } else {
      e++;
    }
    zipElementListData.push(pickElement);
  }
  return zipElementListData;
}

export function createDomFromElementList(
  elementList: IElement[],
  options: DeepRequired<IEditorOption>
) {
  function buildDom(payload: IElement[]): HTMLDivElement {
    const clipboardDom = document.createElement("div");
    for (let e = 0; e < payload.length; e++) {
      const element: any = payload[e];
      // 构造表格
      if (element.type === ElementType.TABLE) {
        const tableDom: HTMLTableElement = document.createElement("table");
        tableDom.setAttribute("cellSpacing", "0");
        tableDom.setAttribute("cellpadding", "0");
        tableDom.setAttribute("border", "0");
        const borderStyle = "1px solid #000000";
        // 表格边框
        if (!element.borderType || element.borderType === TableBorder.ALL) {
          tableDom.style.borderTop = borderStyle;
          tableDom.style.borderLeft = borderStyle;
        } else if (element.borderType === TableBorder.EXTERNAL) {
          tableDom.style.border = borderStyle;
        }
        tableDom.style.width = `${element.width}px`;
        // colgroup
        const colgroupDom = document.createElement("colgroup");
        for (let c = 0; c < element.colgroup!.length; c++) {
          const colgroup = element.colgroup![c];
          const colDom = document.createElement("col");
          colDom.setAttribute("width", `${colgroup.width}`);
          colgroupDom.append(colDom);
        }
        tableDom.append(colgroupDom);
        // tr
        const trList = element.trList!;
        for (let t = 0; t < trList.length; t++) {
          const trDom = document.createElement("tr");
          const tr = trList[t];
          trDom.style.height = `${tr.height}px`;
          for (let d = 0; d < tr.tdList.length; d++) {
            const tdDom = document.createElement("td");
            if (!element.borderType || element.borderType === TableBorder.ALL) {
              tdDom.style.borderBottom = tdDom.style.borderRight = "1px solid";
            }
            const td = tr.tdList[d];
            tdDom.colSpan = td.colspan;
            tdDom.rowSpan = td.rowspan;
            tdDom.style.verticalAlign = td.verticalAlign || "top";
            // 单元格边框
            if (td.borderTypes?.includes(TdBorder.TOP)) {
              tdDom.style.borderTop = borderStyle;
            }
            if (td.borderTypes?.includes(TdBorder.RIGHT)) {
              tdDom.style.borderRight = borderStyle;
            }
            if (td.borderTypes?.includes(TdBorder.BOTTOM)) {
              tdDom.style.borderBottom = borderStyle;
            }
            if (td.borderTypes?.includes(TdBorder.LEFT)) {
              tdDom.style.borderLeft = borderStyle;
            }
            const childDom = createDomFromElementList(td.value!, options);
            tdDom.innerHTML = childDom.innerHTML;
            if (td.backgroundColor) {
              tdDom.style.backgroundColor = td.backgroundColor;
            }
            trDom.append(tdDom);
          }
          tableDom.append(trDom);
        }
        clipboardDom.append(tableDom);
      } else if (element.type === ElementType.HYPERLINK) {
        const a = document.createElement("a");
        a.innerText = element.valueList!.map(v => v.value).join("");
        if (element.url) {
          a.href = element.url;
        }
        clipboardDom.append(a);
      } else if (element.type === ElementType.TITLE) {
        const h = document.createElement(
          `h${titleOrderNumberMapping[element.level!]}`
        );
        h.setAttribute("rowIndex", element?.rowIndex ?? null);
        if (element.valueList[0]?.rowFlex) {
          h.style.textAlign = element.valueList[0]?.rowFlex;
        }
        const childDom = buildDom(element.valueList!);
        h.innerHTML = childDom.innerHTML;
        clipboardDom.append(h);
      } else if (element.type === ElementType.LIST) {
        const list = document.createElement(
          listTypeElementMapping[element.listType!]
        );
        if (element.listStyle) {
          list.style.listStyleType = listStyleCSSMapping[element.listStyle];
        }
        // 按照换行符拆分
        const zipList = zipElementList(element.valueList!);
        const listElementListMap = splitListElement(zipList);
        listElementListMap.forEach(listElementList => {
          const li = document.createElement("li");
          const childDom = buildDom(listElementList);
          li.innerHTML = childDom.innerHTML;
          list.append(li);
        });
        clipboardDom.append(list);
      } else if (element.type === ElementType.IMAGE) {
        const img = document.createElement("img");
        if (element.value) {
          img.src = element.value;
          img.width = element.width!;
          img.height = element.height!;
          img.setAttribute("rowIndex", element?.rowIndex ?? null);
        }
        clipboardDom.append(img);
      } else if (element.type === ElementType.SEPARATOR) {
        const hr = document.createElement("hr");
        clipboardDom.append(hr);
      } else if (element.type === ElementType.CHECKBOX) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (element.checkbox?.value) {
          checkbox.setAttribute("checked", "true");
        }
        clipboardDom.append(checkbox);
      } else if (element.type === ElementType.RADIO) {
        const radio = document.createElement("input");
        radio.type = "radio";
        if (element.radio?.value) {
          radio.setAttribute("checked", "true");
        }
        clipboardDom.append(radio);
      } else if (element.type === ElementType.TAB) {
        const tab = document.createElement("span");
        tab.innerHTML = `${NON_BREAKING_SPACE}${NON_BREAKING_SPACE}`;
        clipboardDom.append(tab);
      } else if (element.type === ElementType.CONTROL) {
        let controlElement = null;
        if (~~element.control?.dsType === 4) {
          controlElement = document.createElement("img");
          controlElement.setAttribute(
            "rowIndex",
            element.control?.value[0]?.rowIndex ?? null
          );
          controlElement.src = `data:image/jpeg;base64,\${${element.control?.dataSource.join(".")}}`;
          controlElement.alt = "Logo";
          controlElement.style = "width:548px;height:114px;visibility:visible";
          if (element.control?.rowFlex || element.control.value[0]?.rowFlex) {
            controlElement.style.textAlign =
              element.control?.rowFlex || element.control.value[0]?.rowFlex;
          }
        } else {
          controlElement = document.createElement("span");
          controlElement.setAttribute(
            "rowIndex",
            element.control?.value[0]?.rowIndex ?? null
          );
          const value0 = element.control?.value[0] || {};
          controlElement.style.fontFamily = value0?.font || options.defaultFont;
          if (value0.bold) {
            controlElement.style.fontWeight = "600";
          }
          if (value0.italic) {
            controlElement.style.fontStyle = "italic";
          }
          controlElement.style.fontSize = `${value0.size || options.defaultSize}px`;
          if (value0.highlight) {
            controlElement.style.backgroundColor = element.highlight;
          }
          if (value0.underline) {
            controlElement.style.textDecoration = "underline";
          }
          if (value0.strikeout) {
            controlElement.style.textDecoration += " line-through";
          }
          if (element.control?.value[0]?.color !== "#999998") {
            controlElement.style.color = element.control?.value[0]?.color;
          }
          const childDom = buildDom(
            zipElementList(element.control?.value || [])
          );
          childDom.innerHTML = `\${${element.control?.dataSource.join(".")}}`;
          if (~~element.control?.dsType === 5) {
            controlElement.setAttribute("dataType", element.control?.dataType); // 添加自定义属性
          }
          if (element.control?.rowFlex || element.control.value[0]?.rowFlex) {
            controlElement.style.textAlign =
              element.control?.rowFlex || element.control.value[0]?.rowFlex;
          }
          controlElement.innerHTML = childDom.innerHTML;
        }
        clipboardDom.append(controlElement);
        // let controlElement = document.createElement('span');
        // let childDom = buildDom(element.control?.value || []);
        // controlElement.innerHTML = childDom.innerHTML;
        // clipboardDom.append(controlElement);
      } else if (
        !element.type ||
        element.type === ElementType.LATEX ||
        TEXTLIKE_ELEMENT_TYPE.includes(element.type)
      ) {
        let text = "";
        if (element.type === ElementType.DATE) {
          text = element.valueList?.map(v => v.value).join("") || "";
        } else {
          text = element.value;
        }
        if (!text) continue;
        const dom = convertElementToDom(element, options);
        // 前一个元素是标题，移除首行换行符
        if (payload[e - 1]?.type === ElementType.TITLE) {
          text = text.replace(/^\n/, "");
        }
        dom.innerText = text.replace(new RegExp(`${ZERO}`, "g"), "\n");
        clipboardDom.append(dom);
      }
    }
    return clipboardDom;
  }
  // 按行布局分类创建dom
  const clipboardDom = document.createElement("div");
  const groupElementList = groupElementListByRowFlex(elementList);
  for (let g = 0; g < groupElementList.length; g++) {
    const elementGroupRowFlex = groupElementList[g];
    // 行布局样式设置
    const isDefaultRowFlex =
      !elementGroupRowFlex.rowFlex ||
      elementGroupRowFlex.rowFlex === RowFlex.LEFT;
    // 块元素使用flex否则使用text-align
    const rowFlexDom = document.createElement("div");
    if (!isDefaultRowFlex) {
      const firstElement = elementGroupRowFlex.data[0];
      if (getIsBlockElement(firstElement)) {
        rowFlexDom.style.display = "flex";
        rowFlexDom.style.justifyContent = convertRowFlexToJustifyContent(
          firstElement.rowFlex!
        );
      } else {
        rowFlexDom.style.textAlign = convertRowFlexToTextAlign(
          elementGroupRowFlex.rowFlex!
        );
      }
    }
    // 布局内容
    rowFlexDom.innerHTML = buildDom(elementGroupRowFlex.data).innerHTML;
    // 未设置行布局时无需行布局容器
    if (!isDefaultRowFlex) {
      clipboardDom.append(rowFlexDom);
    } else {
      rowFlexDom.childNodes.forEach(child => {
        clipboardDom.append(child.cloneNode(true));
      });
    }
  }
  return clipboardDom;
}
export function getHTMLRewrite(instance: any) {
  const { draw, contextMenu } = instance;
  const { options } = contextMenu;
  const mainElementList = draw.getOriginalMainElementList();
  mainElementList.forEach((item, i) => {
    item.positionList = draw.position.positionList[i];
    item.rowIndex = draw.position.positionList[i].rowIndex;
  });
  const createDomFromElementList1 = createDomFromElementList(
    mainElementList,
    options
  );
  const children: any = createDomFromElementList1.children;
  const rowIndexToDiv = {};
  const htmlDom = document.createElement("div");
  for (let e = 0; e < children.length; e++) {
    const rowIndex = children[e].getAttribute("rowIndex");

    console.dir(children[e]);

    const textAlign = children[e]?.style.textAlign || "";
    if (rowIndex !== null) {
      if (!rowIndexToDiv[rowIndex]) {
        rowIndexToDiv[rowIndex] = document.createElement("div");
        if (textAlign) {
          rowIndexToDiv[rowIndex].style.textAlign = textAlign;
        }
        rowIndexToDiv[rowIndex].setAttribute("rowIndex", rowIndex);
        htmlDom.appendChild(rowIndexToDiv[rowIndex]);
      }
      const childClone = children[e].cloneNode(true);
      rowIndexToDiv[rowIndex].appendChild(childClone);
    } else {
      // if (children[e].tagName === 'TABLE') {
      //     let trs = children[e].getElementsByTagName('tr');
      //     for (let t = 0; t < trs.length; t++) {
      //         let tds = trs[t].getElementsByTagName('td');
      //         for (let d = 0; d < tds.length; d++) {
      //             let spans = tds[d].getElementsByTagName('span');
      //             for (let s = 0; s < spans.length; s++) {
      //                 tds[d].style.textAlign = 'left';
      //                 let textAlign = spans[s].style.textAlign;
      //                 if (textAlign) {
      //                     // 将 span 的 textAlign 值应用到 td 上
      //                     tds[d].style.textAlign = textAlign;
      //                 }
      //             }
      //         }
      //     }
      //     let div = document.createElement('div');
      //     let textAlign = children[e].style.textAlign;
      //     console.dir(children[e]);
      //     if (textAlign) {
      //         div.style.display = 'flex';
      //         switch (textAlign) {
      //             case 'left':
      //                 div.style.justifyContent = 'flex-start';
      //                 break;
      //             case 'center':
      //                 div.style.justifyContent = 'center';
      //                 break;
      //             case 'right':
      //                 div.style.justifyContent = 'flex-end';
      //                 break;
      //             default:
      //                 break;
      //         }
      //     }
      //     div.appendChild(children[e].cloneNode(true));
      //     htmlDom.appendChild(div);
      // } else if (children[e].tagName === 'IMG') {
      //     let div = document.createElement('div');
      //     div.style.textAlign = children[e].style.textAlign;
      //     div.appendChild(children[e].cloneNode(true));
      //     htmlDom.appendChild(div);
      // } else {
      htmlDom.appendChild(children[e].cloneNode(true));
      // }
    }
  }
  return {
    main: htmlDom.innerHTML
    // main: createDomFromElementList(mainElementList, options).innerHTML,
  };
}
