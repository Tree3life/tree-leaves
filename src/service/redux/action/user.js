import ACTION from "@/service/redux/action-type";


/**
 * 以下是 所有和 reducer：person 相关的action
 * 即用于改变状态的方法
 * @param data
 * @returns {{data, type: string}}
 */
export const tempStorageUserInfo = data => ({type: ACTION.tempStorageUserInfo, data})


//异步操作redux
export const login = data => (() => {
    return (dispatch) => {

        return {type: ACTION.userLogin, data}
    }
})
