/**
 * 表格时间格式化
 */
export const formatISODate = (isoString, type) => {
    const date = new Date(isoString);
    var year = date.getFullYear();// 年
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;// 月
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();// 日
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();// 时
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();// 分
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();// 秒
    var milliseconds = date.getMilliseconds() < 10 ? "0" + date.getMilliseconds() : date.getMilliseconds() // 毫秒
    if (type === 1) {
        return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds + "." + milliseconds;
    } else if (type === 2) {
        return year + "" + month + "" + day + "" + hour + "" + minutes + "" + seconds;
    } else if (type === 3) {
        return year + "-" + month + "-" + day;
    }
    else if (type === 4) {
        return month + "-" + day + " " + hour + ":" + minutes;
    }
    else {
        return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
    }
}
/**
 * 判断是否为空
 */
export const validatenull = (val) => {
    if (typeof val == "boolean") {
        return false;
    }
    if (typeof val == "number") {
        return false;
    }
    if (val instanceof Array) {
        if (val.length == 0) return true;
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === "{}") return true;
    } else {
        if (
            val == "null" ||
            val == null ||
            val == "undefined" ||
            val == undefined ||
            val == ""
        )
            return true;
        return false;
    }
    return false;
}
// 删除指定id的元素
export function removeElementById(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}