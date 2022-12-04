import {post} from '@/server/http'


export function uploadExcel(obj,config) {
    return post('/upload/excel.do', obj,config)
}