import ACTION from "@/service/redux/action-type";
import {sysRole} from "@/server";

/**
 * 返回一个 将后端数据存入cache中的 action
 * @param data
 * @returns {{data, type: symbol}}
 */
export const saveInCache = data => {
    return {type: ACTION.saveInCache, data}
}
export const getCachedRoleOptions = () => () => {
    return (dispatch, getState) => {
        let roleList = sysRole.getSysRoleList({});
         dispatch({type: ACTION.getCachedRoleOptions, roleList})
    }
}

// export const changeRecommendsAction = (recommends) => ({
//     type: CHANGE_RECOMMENDS,
//     recommends
// })
//
// export const fetchHomeMultidataAction = () => {
//     // 派发时返回的该函数自动执行, 且传入两个参数dispatch, getState
//     return (dispatch, getState) => {
//         axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
//             const banners = res.data.data.banner.list
//             const recommends = res.data.data.recommend.list
//
//             // 获取到数据后在派发action
//             dispatch(changeBannersAction(banners))
//             dispatch(changeRecommendsAction(recommends))
//         })
//     }
// }



