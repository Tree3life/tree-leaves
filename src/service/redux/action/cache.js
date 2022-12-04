import ACTION from "@/service/redux/action-type";

/**
 * 返回一个 将后端数据存入cache中的 action
 * @param data
 * @returns {{data, type: symbol}}
 */
export const saveInCache = data => ({type: ACTION.saveInCache, data})
