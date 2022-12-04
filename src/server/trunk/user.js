import { get, post} from '@/server/http'


/**
 * 此文件中的方法可以使用箭头函数进行简化
 */
/**
 * 返回一个空的user对象
 * @returns {{password: string, deleted: string, gender: string, createTime: string, name: string, updateTime: string, id: string, locked: string, age: string, username: string}}
 */
export function user() {
    return {
        id: "",
        username: "",
        password: "",
        name: "",
        age: "",
        gender: "",
        createTime: "",
        updateTime: "",
        locked: "",//锁定，删除，正常
        deleted: ""
    }
}


/**
 * 查询user的接口
 * @param data
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export const getUser = (data) => get("/sysUser/get/" + data)

/**
 * 查询user 返回 list
 * @param info
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export  function getUserList(info) {
    return  get('/sysUser/list', info)
}

export function saveUser(obj) {
    return post('/sysUser/save', obj)
}

export function updateUser(obj) {
    return post('/sysUser/update', obj)
}

export function deleteUser(obj) {
    return post('/sysUser/delete', obj)
}

