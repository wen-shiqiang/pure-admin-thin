/**
 * 通用工具类
 */
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) {
    return;
  }
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) {
    return;
  }
  var value = window.localStorage.getItem(name);
  if (value !== null) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.log(e);
    }
  }
  return value;
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) {
    return;
  }
  window.localStorage.removeItem(name);
};

/**
 * 存储sessionStorage
 */
export const setseStore = (name, content) => {
  if (!name) {
    return;
  }
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

/**
 * 获取sessionStorage
 */
export const getseStore = name => {
  if (!name) {
    return;
  }
  var value = window.sessionStorage.getItem(name);
  if (value !== null) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.log(e);
    }
  }
  return value;
};

/**
 * 删除sessionStorage
 */
export const removeseStore = name => {
  if (!name) {
    return;
  }
  window.sessionStorage.removeItem(name);
};

/**
 * 判断空值
 */
export const isEmpty = keys => {
  if (typeof keys === "string") {
    keys = keys.replace(/\"|&nbsp;|\\/g, "").replace(/(^\s*)|(\s*$)/g, "");
    return keys == "" || keys == null || keys == "null" || keys === "undefined"
      ? true
      : false;
  } else if (typeof keys === "undefined") {
    // 未定义
    return true;
  } else if (typeof keys === "number") {
    return false;
  } else if (typeof keys === "boolean") {
    return false;
  } else if (keys instanceof Array && keys.length == 0) {
    // 数组
    return true;
  } else if (typeof keys == "object") {
    if (JSON.stringify(keys) == "{}" || JSON.stringify(keys) == "[]") {
      return true;
    } else if (keys == null) {
      // null
      return true;
    } else {
      return false;
    }
  }
  return false;
};
// 判断类型
export const toType = val => {
  // 如果检测的数据类型是null或者undefined直接用返回当前值加空字符串
  if (val == null) {
    return `${val}`;
  }
  const obj = {},
    testMethod = obj.toString;
  "Boolean Number String Function Array Date RegExp Object"
    .split(" ")
    .forEach(item => {
      obj[`[object ${item}]`] = item.toLowerCase();
    });

  /*
    obj如下：
    {
       [object Array]: "array",
       [object Boolean]: "boolean",
       [object Date]: "date",
       [object Function]: "function",
       [object Number]: "number",
       [object Object]: "object",
       [object RegExp]: "regexp",
       [object String]: "string",
    }
    */
  if (typeof val === "object" || typeof val === "function") {
    return obj[testMethod.call(val)];
  }
  return typeof val;
};

/**
 * 动态路由
 */
export const generateRoutesFromMenu = (
  menuData = [],
  routes = [],
  componentNew
) => {
  for (var i = 0; i < menuData.length; i++) {
    const menuobj = menuData[i];
    const component = menuData[i].component;
    if (component && component !== "content") {
      componentNew = require(`pages/admin/${menuData[i].component}.vue`);
    }
    menuobj["component"] = componentNew;
    routes.push(menuobj);
    generateRoutesFromMenu(menuobj.children);
  }

  return routes;
};

// 取url路径 vue路由路径
export const GetRouterRequest = name => {
  var reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  var param = window.location.hash.split("?")[1];
  if (!param) {
    return null;
  }
  var r = param.match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
};

// 取url路径 转为对象
export const GetRouterObj = () => {
  var param = window.location.hash.split("?")[1];
  var theRequest = new Object();
  if (!param) {
    return theRequest;
  }
  var strs = param.split("&");
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return theRequest;
};
// 深拷贝
export const deepclone = (sObj, cObj) => {
  cObj = cObj || (Array.isArray(sObj) ? [] : {});

  for (const i in sObj) {
    if (typeof sObj[i] === "object") {
      cObj[i] = Array.isArray(sObj[i]) ? [] : {};
      deepclone(sObj[i], cObj[i]);
    } else {
      cObj[i] = sObj[i];
    }
  }
  return cObj;
};
//  给表格添加业务数据
export const tableDataEach = widgetFormPreview => {
  widgetFormPreview.list.forEach(item => {
    if (item.type === "table") {
      item.tableContent = [];
      item.isNeedShow = true;
      if (!item.isShowTable) {
        item.isNeedShow = false;
      }
      if (item.options.defaultValue != null) {
        item.options.defaultValue.forEach(opt => {
          opt.dataOfTables.forEach(dataOpt => {
            const addList = JSON.parse(JSON.stringify(item.addRowList));
            addList.addRowOptList = {};
            for (const key in opt) {
              if (key !== "dataOfTables") {
                addList.addRowOptList[key] = opt[key];
              }
            }
            addList.addRowOptList.dataOfTables = JSON.parse(
              JSON.stringify(dataOpt)
            );
            addList.wholeRequired = dataOpt.wholeRequired || 0;
            addList.id = dataOpt.id || "";
            addList.totalType = dataOpt.totalType || 0;
            addList.settingId = opt.settingId || "";
            addList.isunified = dataOpt.isunified || "";
            addList.is_school = dataOpt.is_school ?? "";
            addList.stsid = dataOpt.stsid || "";
            addList.typeFlag = dataOpt.typeFlag || 0;
            addList.isDisabled = dataOpt.isDisabled ?? null;
            addList.isRepetitive = dataOpt.isRepetitive ?? 0;
            addList.managerId = dataOpt.managerId ?? null;
            addList.courseId = dataOpt.courseId ?? null;
            let refTypeObj = {};
            // typeFlag  =2  总计  typeFlag = 1 小计
            // 内置课程类别之前的列，需要去除合计判断，使数据向上合计
            let typeFlag = 0;
            addList.forEach(tdVal => {
              if (
                dataOpt[tdVal.model] === null ||
                dataOpt[tdVal.model] === undefined ||
                dataOpt[tdVal.model] === "" ||
                dataOpt[tdVal.model] === "null"
              ) {
                tdVal.value = "";
                tdVal.valueTxt = "";
              } else {
                const obj = JSON.parse(dataOpt[tdVal.model]);
                if (
                  tdVal.dataKey &&
                  tdVal.dataKey !== "11032" &&
                  tdVal.dataKey !== 11032
                ) {
                  if (!tdVal.multipleTip) {
                    if ((obj?.value ?? "") !== "" || (obj?.id ?? "") !== "") {
                      const obj2 = {
                        label: obj.value,
                        value: obj.id
                      };
                      tdVal.value = obj2;
                      tdVal.valueOld = obj2;
                      tdVal.valueTxt = obj.value;
                      tdVal.valueTxtOld = obj.value;
                      if (tdVal.remoteOptions && !tdVal.remoteOptions.length) {
                        tdVal.remoteOptionsOld = [obj2] || [];
                      }
                    } else {
                      tdVal.value = "";
                      tdVal.valueTxt = "";
                    }
                  } else {
                    const obj2 = [];
                    let values = [];
                    if (obj.value) {
                      values =
                        obj.value.indexOf(",") > -1
                          ? obj.value.split(",")
                          : obj.value.split("，");
                    }
                    toType(obj.id) == "array" &&
                      obj?.id?.length &&
                      obj.id.forEach((id, index) => {
                        const obj3 = {
                          label: values[index],
                          value: id
                        };
                        obj2.push(obj3);
                      });
                    tdVal.value = obj2 || [];
                    tdVal.valueOld = obj2 || [];
                    tdVal.valueTxt = obj.value;
                    tdVal.valueTxtOld = obj.value;
                    if (tdVal.remoteOptions && !tdVal.remoteOptions.length) {
                      tdVal.remoteOptionsOld = obj2 || [];
                    }
                  }
                } else {
                  tdVal.value = obj.id;
                  tdVal.valueOld = obj.id;
                  tdVal.valueTxt = obj.value;
                  tdVal.valueTxtOld = obj.value;
                }
                if (tdVal.model == "refType") {
                  refTypeObj =
                    JSON.parse(dataOpt.refType) ||
                    JSON.parse(dataOpt.refType1) ||
                    {};
                }
                tdVal.refTypeValue = refTypeObj && refTypeObj.value;
              }
              typeFlag = dataOpt.typeFlag || 0;
              if (tdVal.model == "refType") {
                if (tdVal.valueTxt === "总计") {
                  tdVal.myModel = 1;
                } else if (tdVal.valueTxt == "小计") {
                  tdVal.myModel = 1;
                } else {
                  tdVal.myModel = 2;
                  tdVal.isRowspan = 1;
                }
              }
              if (tdVal.model == "refType1") {
                if (tdVal.valueTxt == "总计") {
                  tdVal.myModel = 1;
                } else if (tdVal.valueTxt == "小计") {
                  tdVal.myModel = 1;
                } else {
                  tdVal.myModel = 3;
                  tdVal.isRowspan = 1;
                }
              }
              if (tdVal.model != "refType" && tdVal.model != "refType1") {
                tdVal.typeFlag = typeFlag || 0;
              } else {
                tdVal.typeFlag = 0;
              }
              tdVal.is_school = dataOpt.is_school ?? "";
              tdVal.isDisabled = dataOpt.isDisabled ?? "";
              tdVal.notValidate = dataOpt.wholeRequired || dataOpt.totalType; // 总计、小计不校验
            });
            return item.tableContent.push(addList);
          });
        });
      }
    }
  });
};
// 把数据源放到数据结构上 export const dataSource = (widgetFormPreview) =>
export const dataSource = widgetFormPreview => {
  widgetFormPreview.list.forEach(item => {
    if (item.type == "table") {
      item.addRowList = [];
      for (let j = 0; j < item.tableColumns.length; j++) {
        const tbItem = item.tableColumns[j];
        if (tbItem.model === "refType1") {
          item.tableColumns.splice(j, 1);
          item.multiLayer.forEach((item1, index, arr) => {
            arr[index].splice(j, 1);
          });
          j--;
          continue;
        }
        if (tbItem.remoteOptions) {
          tbItem.remoteOptions.forEach(val => {
            if (val.dataMap) {
              val.dataMap = JSON.parse(val.dataMap);
            }
          });
        }
        tbItem.model_index = j;
        tbItem.field = "valueTxt";
        item.addRowList.push({
          model: tbItem.model,
          value: "",
          multipleTip: tbItem.multipleTip,
          tableField:
            tbItem.data_source && tbItem.data_source[0]
              ? tbItem.data_source[0].table_field
              : "",
          dataKey:
            tbItem.data_source && tbItem.data_source[0]
              ? tbItem.data_source[0].data_key
              : "",
          remoteData: tbItem.remoteData,
          remoteOptions: tbItem.remoteOptions,
          required: tbItem.required,
          pattern: tbItem.pattern,
          promptMsg: tbItem.promptMsg,
          secondLevelGet: tbItem.secondLevelGet,
          secondFiltrate: tbItem.secondFiltrate,
          disabled: tbItem.disabled,
          isRowspan: tbItem.isRowspan || 0,
          refTypeValue: tbItem.refTypeValue || "",
          readonly: tbItem.readonly || false,
          myModel: 1,
          model_index: j,
          typeFlag: 0,
          isRepetitive: tbItem.isRepetitive ?? 0,
          managerId: tbItem.managerId ?? null,
          isDisabled: tbItem.isDisabled ?? null
        });
      }
    }
  });
  return tableDataEach(widgetFormPreview);
};

// 动态表单 数据渲染
export const EachTemplate = item => {
  if (item.mcontentForm === null || item.mcontentForm === undefined) {
    item.mcontentForm = {};
    item.mcontentForm.formJson = {
      list: [],
      config: { labelPosition: "left", labelWidth: 100 }
    };
    item.mcontentForm.formJsonEdit = {
      list: [],
      config: { labelPosition: "left", labelWidth: 100 }
    };
  } else {
    if (typeof item.mcontentForm.formJson === "string") {
      item.mcontentForm.formJson = JSON.parse(item.mcontentForm.formJson);
    }
    item.mcontentForm.formJsonEdit = item.mcontentForm.formJson;

    if (item.isEditor) {
      item.mcontentForm.formJson.list[0] &&
        (item.mcontentForm.formJson.list[0].isShowTable = false);
    } else {
      item.mcontentForm.formJson.list[0] &&
        (item.mcontentForm.formJson.list[0].isShowTable = true);
    }
    if (item.showOperation) {
      item.mcontentForm.formJson.list[0] &&
        (item.mcontentForm.formJson.list[0].showOperation = false);
    } else {
      item.mcontentForm.formJson.list[0] &&
        (item.mcontentForm.formJson.list[0].showOperation = true);
    }

    // 判断是否合并教学进程表
    item.isMerge &&
      item.mcontentForm.formJson.list[0] &&
      (item.mcontentForm.formJson.list[0].isMerge = true);

    // 多人编辑是否显示设置新增删除导入按钮
    item.buttonSwitch &&
      item.mcontentForm.formJson.list[0] &&
      (item.mcontentForm.formJson.list[0].buttonSwitch = true);
  }
  item.mcontentForm.formJson.list.forEach(val => {
    val.palteName = item.mcName;
    val.formId = item.mcontentForm.id;
    val.mcontentid = item.mcontentForm.mcontentid;
    val.refId = val.model + item.mcontentForm.mcontentid; // 用于区分同一个表单中的不同字段
    val.typetable = 1;
    if (val.type === "grid") {
      // 珊格布局
      val.columns.forEach(colValList => {
        colValList.list.forEach(colVal => {
          if (colVal.type === "checkbox") {
            let str = item.mcontentForm.formData[colVal.model];
            if (
              str !== null &&
              str !== "null" &&
              str !== "undefined" &&
              str !== undefined
            ) {
              if (str == "") {
                str = "[]";
              }
              const type = toType(str);
              colVal.options.defaultValue =
                type === "string"
                  ? JSON.parse(str)
                  : JSON.parse(JSON.stringify(str));
            }
          } else if (colVal.type == "select") {
            // 下拉框
            let str = item.mcontentForm.formData[colVal.model];
            if (str) {
              if (str.length != 0 && colVal.options.multiple) {
                if (str == "") {
                  str = "[]";
                }
                colVal.options.defaultValue = JSON.parse(str);
              } else {
                if (colVal.data_source[0].table_field != "") {
                  colVal.options.defaultValue = JSON.parse(str);
                } else {
                  colVal.options.defaultValue = str;
                }
              }
            }
          } else {
            colVal.options.defaultValue =
              item.mcontentForm.formData[colVal.model] || "";
          }
        });
      });
    } else if (val.type == "checkbox") {
      // 多选框
      let str = item.mcontentForm.formData[val.model];
      if (
        str !== null &&
        str !== "null" &&
        str !== "undefined" &&
        str !== undefined
      ) {
        if (str == "") {
          str = "[]";
        }
        const type = toType(str);
        val.options.defaultValue =
          type === "string" ? JSON.parse(str) : JSON.parse(JSON.stringify(str));
      } else {
        val.options.defaultValue = str;
      }
    } else if (val.type == "select") {
      // 下拉框
      let str = item.mcontentForm.formData[val.model];
      if (str) {
        if (str.length != 0 && val.options.multiple) {
          if (str == "") {
            str = "[]";
          }
          val.options.defaultValue = JSON.parse(str);
        } else {
          if (val.data_source[0].table_field != "") {
            val.options.defaultValue = JSON.parse(str);
          } else {
            val.options.defaultValue = str;
          }
        }
      }
    } else if (val.type == "fileUpload") {
      // 文件上传
      const str = item.mcontentForm.formData[val.model];
      if (str != "") {
        if (typeof str === "string") {
          val.options.defaultValue = JSON.parse(str);
          item.mcontentForm.defaultValuess = JSON.parse(str);
        } else {
          val.options.defaultValue = str;
          item.mcontentForm.defaultValuess = str;
        }
      } else {
        val.options.defaultValue = "";
      }
    } else if (val.type == "input" || val.type == "cloze") {
      const str = item.mcontentForm.formData[val.model];
      val.options.defaultValue = str;
    } else if (val.type == "inline") {
      val.list.forEach(colVal => {
        if (colVal.type === "cloze") {
          colVal.options.defaultValue =
            item.mcontentForm.formData[colVal.model] || "";
        }
      });
    } else {
      val.options.defaultValue = item.mcontentForm.formData[val.model] || "";
    }
  });
  return dataSource(item.mcontentForm.formJson);
};

// 节流
export const throttle = (func, delay = 500) => {
  // 缓存一个定时器
  let timer = null;
  // 这里返回的函数是每次用户实际调用的节流函数
  return function () {
    if (!timer) {
      // 判断timer是否有值,如果没有则说明定时器不存在即可继续执行
      timer = setTimeout(() => {
        // 关
        func.apply(this, arguments);
        timer = null; // 开
      }, delay);
    }
  };
};

// 按专指委筛选时，组装专业id
export const buildMajorsParam = (param, searchForm, group) => {
  if (param.isOrganization != 1) {
    return;
  }
  const majorid = "majorid" in param ? "majorid" : "majorId";
  const deptid = "deptid" in param ? "deptid" : "deptId";
  if (!param[deptid] && !param[majorid]) {
    // 学院、专业都不选
    const list = [];
    group.childs.forEach(item => {
      item.childs?.forEach(item1 => {
        list.push(item1.dmId);
      });
    });
    searchForm.majors = param.majors = list;
  } else if (param[majorid]) {
    // 选择了专业
    searchForm.majors = param.majors = [param[majorid]];
  } else {
    // 选择学院不选专业
    const dept = group.childs.find(item => item.dmId === param[deptid]);
    searchForm.majors = param.majors = dept.childs?.map(item => item.dmId);
  }
  // 审批单需要加上部门
  searchForm.organizationDeptIds = param.organizationDeptIds = param[deptid]
    ? [param[deptid]]
    : group.childs.map(item => item.dmId);
  delete param.majorid;
  delete param.majorId;
  delete param.deptid;
  delete param.deptId;
};
// 按专指委筛选时，组装导出参数
export const buildOrganizationExportParam = (searchForm, form) => {
  if (searchForm.isOrganization != 1) {
    return;
  }
  ["majorid", "majorId", "deptid", "deptId"].forEach(item => {
    const input = form.querySelector(`input[name=${item}]`);
    if (input) {
      form.removeChild(input);
    }
  });
  ["isOrganization", "majors", "organizationDeptIds"].forEach(item => {
    const input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", item);
    input.setAttribute("value", searchForm[item]);
    form.append(input);
  });
};
