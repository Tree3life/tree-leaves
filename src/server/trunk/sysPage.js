import {post, proGet} from '@/server/http'
// reload
/**
 * @param data
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export const getMenuCrude = (data) => proGet("/sysPage/list" ,data)

export function saveSysPage(obj) {
    return post('/sysPage/save', obj)
}

export function updateSysPage(obj) {
    return post('/sysPage/update', obj)
}

export function deleteSysPage(obj) {
    return post('/sysPage/delete', obj)
}

