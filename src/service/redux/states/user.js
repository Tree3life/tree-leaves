/**
 * 本文件是reducer和action的结合
 */
import ACTION from '@/service/redux/action-type'

/**
 * reducer：person
 * @type {[{name: string, id: string, age: number}]}
 */
const initState ={}
export  function user(preState=initState, action) {
    const {type, data} = action
    switch (type) {
        case ACTION.tempStorageUserInfo: //暂存登录成功的用户信息
            //preState.unshift(data) //此处不可以这样写，这样会导致preState被改写了，personReducer就不是纯函数了。
            return {...preState,...data}
        default:
            return preState
    }
}



