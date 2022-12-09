/**
 * 本文件用于缓存从后台请求过来的数据，
 * 1.要求：
 * i： catch中缓存的数据，只能进行读操作，不允许进行写操作；
 *          （与其它平级reducer文件的区别：
 *           a：对象不同 -->     其它reducer是共享组件间的数据，本文件的reducer是保存服务器共享出来的数据）
 *           b：读写性质不同 -->  其它reducer可以进行写操作，但是本文件不允许进行写操作）
 * ii：catch 要以json对象形式存储 后端初次请求后端响应回来的数据；这里的`写操作`与上述的`写操作`是不同的;
 *
 * 2.缓存策略或者说缓存原则（即哪些数据是需要、应当、甚至是必须要被缓存的）：
 * i. 在前端被多次重复使用，并且每次调用都需要发送请求从后端获取；
 * ii.后端响应的数据不随请求次数的增加而经常改变；(可能会刷新)
 *
 * 3.意义：减少对后端的无意义的请求
 * @param preState
 * @param data
 * @returns {{}|*}
 */
import ACTION from "@/service/redux/action-type";

let formOptions = JSON.parse(localStorage.getItem("$formOptions"));

//todo 异步redux远程初始化加载$formOptions的roleOptions
const initState = {"娃哈哈": "只能读,不能写","$formOptions":formOptions}

/**
 * cache 本项目内部的缓存区
 * @param preState
 * @param data
 * @returns {{}|*}
 */
export function cache(preState = initState, action) {
    const {type, data} = action
    /**
     * 猜测: reducer中的switch case /else 等分支最后会被汇总到一起进行判断
     */
    if (type === ACTION.saveInCache) {
        // 获取data中的所有对象，并存入到catch中
        return {...preState, ...data}
    } else {
        return preState
    }
}

