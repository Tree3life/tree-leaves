import {get, post, put, del, patch, proGet} from './http.js'
import * as application from "./application";
import * as user from './trunk/user'
import * as sysRole from './trunk/sysRole'
// import * as websocket from './websocket'
import * as sysPerm from './trunk/sysPerm'
import * as sysPage from './trunk/sysPage'
import * as upload from './trunk/upload'

/**
 * 本文件用于注册后端请求
 * 步骤：
 * step1:引入新增的api文件；
 * step2:暴露对象  ；
 *
 * 范例：
 * step1：import http from '@/service/http'
 * step2：将http对象注册到export default{}中
 */


/**
 * 统一暴露所有的业务请求接口
 * 使用示例：页面中调用user 对象的getUser()方法
 *       step1:import {user} from "../xxx/server";；
 *       step2: let respData= await user.getUser(2);//注：await 关键字要在 async关键字修饰的方法内部使用 async() => {await server()}
 * 注意事项：
 *       1.此处若使用 export default 会导致无法在页面 中 无法解构引入
 */
export {
    get, post, put, del, patch, proGet,//基础的http请求
    application,
    // websocket,
    user,
    sysRole,
    sysPerm,
    sysPage,
    upload
}


/**
 * 接口调用案例
 import {user} from "../../server";
 sendRequest = async () => {
    //调用接口
    let serviceResp = await user.getUser(2);
    let serviceResps = await user.getUserList();
    console.log(serviceResp)
    console.log(serviceResps)
}
 */
