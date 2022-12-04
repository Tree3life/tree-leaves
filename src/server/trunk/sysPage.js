import {proGet} from '@/server/http'
// reload
/**
 * 刷新系统资源的接口
 * @param data
 * @returns {Promise<commander.ParseOptionsResult.unknown>}
 */
export const getMenuCrude = (data) => proGet("/sysPage/list" ,data)
