import {get, post} from '@/server/http'

/**
 * 返回一个空的sysPerm对象
 * @returns {}
 */
export function sysPerm() {
    return {

    }
}


// reload
/**
 * 刷新系统资源的接口
 * @param data
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export const reloadSysPerm = (data) => get("/sysPerm/reload" )


export  function getSysPermList(info) {
    return  get('/sysPerm/list', info)
}

export function saveSysPerm(obj) {
    return post('/sysPerm/save', obj)
}

export function updateSysPerm(obj) {
    return post('/sysPerm/update', obj)
}

export function deleteSysPerm(obj) {
    return post('/sysPerm/delete', obj)
}
