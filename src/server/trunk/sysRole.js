import { get, post} from '@/server/http'


/**
 * 此文件中的方法可以使用箭头函数进行简化
 */
/**
 * 返回一个空的sysRole对象
 * @returns {}
 */
export function sysRole() {
    return {

    }
}


/**
 * 查询sysRole的接口
 * @param data
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export const getSysRole = (data) => get("/sysRole/get/" + data)

/**
 * 查询sysRole 返回 list
 * @param info
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export  function getSysRoleList(info) {
    return  get('/sysRole/list', info)
}

export function saveSysRole(obj) {
    return post('/sysRole/save', obj)
}

export function updateSysRole(obj) {
    return post('/sysRole/update', obj)
}

export function deleteSysRole(obj) {
    return post('/sysRole/delete', obj)
}

