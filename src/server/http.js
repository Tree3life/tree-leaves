/* ajax封装 */
import axios from 'axios'
import {message} from "antd";
import settings from '@/resource/application'
import history from "@/util/history";


//region axios初始化
// axios.defaults.headers["Content-Type"] = "application/json";
const service = axios.create({
    // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // server 的 base_url
    headers: {
        "Content-Type": "application/json",
    },
    baseURL: settings.base_url, // server 的 base_url
    timeout: settings.timeout, // 请求超时时间
})
//endregion axios初始化

//region axios请求拦截器
/**
 * axios请求拦截器：
 * 可在此处对请求做统一设置-- > 携带token
 */
service.interceptors.request.use(config => {
    // config.data = JSON.stringify(config.data);
    //在请求头headers中添加token
    config.headers["Authorization"] = localStorage.getItem(settings.token_key)
    // config.headers["Authorization"] = "Bearer "+"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjUzIiwicm9sZXMiOiJbe1wicm9sZVwiOlwiYWRtaW5cIixcImRlbGV0ZWRcIjpmYWxzZSxcImlkXCI6MSxcImxvY2tlZFwiOmZhbHNlfSx7XCJyb2xlXCI6XCJzeXN0ZW1cIixcImRlbGV0ZWRcIjpmYWxzZSxcImlkXCI6MixcImxvY2tlZFwiOmZhbHNlfV0iLCJpc3MiOiJXSU4tMEk1M0dDSDVVN0ovMTkyLjE2OC4xLjMiLCJleHAiOjE2Njg5NDg1NDgsImxvY2tlZCI6ZmFsc2UsImlhdCI6MTY2ODk0NDk0OCwidXNlcklkIjoxMjUzLCJqdGkiOiI4NmUwM2VlNi02YjFmLTMwZGMtOGQ5Yy0xMTI4ZGM3MjUwNzgiLCJ1c2VybmFtZSI6IuaJp-eslOeUu-a4heecuCJ9.CPjiGHrFRcvcLfZwXqKJQCBL4gqHajUt3u8HHQ140Bw"

    return config;
}, error => {
    Promise.reject(error)
})
//endregion axios请求拦截器

//region axios响应拦截器
service.interceptors.response.use(resp => {
    console.log(">>>>>>>>>>>>>>>>>>：", resp)
    /*todo 1.根据实际项目设计进行数据解析*/
    /*todo 2.解密请求报文*/
    /* 此处处理自定义业务码：响应结果 符合预期数据 */
    /**
     *   此处相当于统一异常处理，当发生异常时，此处简单的对异常信息进行格式化；
     *   在请求方法处将异常展示
     */
    switch (resp.data.code) {
        case 2000://成功
            return resp.data;
        case 2001://未登录
            console.log("响应码：" + resp.data.code + " >>>>>>>>>>>>>>>>>>：", resp);
            history.push('/');
            return Promise.reject(resp.data.message);
        case 2002://账号不存在
            console.log("响应码：" + resp.data.code + " >>>>>>>>>>>>>>>>>>：", resp);
            // history.push('/');
            return Promise.reject(resp.data.message);
        case 2006://权限不足
            console.log("响应码：" + resp.data.code + " >>>>>>>>>>>>>>>>>>：", resp);
            return Promise.reject(resp.data.message + "：" + resp.config.url);
        case 2004://用户不存在
            console.log("响应码：" + resp.data.message + " >>>>>>>>>>>>>>>>>>：", resp);
            return Promise.reject(resp.data.message);
        case 4001://非法token或token失效
            console.log("响应码：" + resp.data.code + " >>>>>>>>>>>>>>>>>>：", resp);
            history.push('/');
            return Promise.reject(resp.data.message);
        default://`凡是不返回2000的都是错误的数据，应当在此处进行处理；也就是说非法的返回值，应当止步于此；`
            console.log("响应码：" + resp.data.code + "未知的响应异常>>>>>>>>>>>>>>>>>>：", resp);
            return Promise.reject(new Error(resp.data.message));
    }
}, errobj => {
    /* 1.请求失败结果处理 */
    /* 2.优化分支结构的处理 */
    // console.log('检查http.js中的axios响应拦截器失败时的处理逻辑', error);
    //error.response.data：包含了错误信息
    //3.决策处理响应失败的逻辑
    // error.response.data={timestamp: '2022-07-22T02:05:01.647+0000', status: 404, error: 'Not Found', message: 'No message available', path: '/tUserFriends/get3/2'}
    if (errobj.response === undefined) {
        message.error("Network Error", 5)
        return Promise.reject(() => {
        })
    }
    const respErr = errobj.response.data;
    let {
        // error,
        path,
        status,
        // timestamp
    } = respErr

    // 根据请求状态 处理
    if (status === 401) {
        // store.commit('REMOVE_INFO')
        // router.push({
        //   path: '/login'
        // })
        // error.message = '请重新登陆'
    }
    if (status === 403) {
        // error.message =status+ '权限不足，无法访问！'
    }
    if (status === 404) {
        //替换原有的错误消息
        errobj.message = status + '：找不到请求路径`  ' + path + '`  ！'
    }

    //Promise.reject：此方法用于中断 Promise链；即 中断 向下传递错误
    //第二个参数是 弹框持续时间
    // duration：持续时间
    message.error(errobj.message, 5)
    return Promise.reject(() => {
    })
})
//endregion region

//region axios封装
/**
 * axios封装
 * resolve：解析；此方法处可对响应结果做一些预处理
 * reject：拒绝，排斥；reject()返回一个带有拒绝原因的Promise对象
 *
 */
/**
 * 封装Restful风格的get请求：
 * 使用范例：
 * 后端接口：blog/get/{id}，(假设id值为1)
 * 调用方式1（使用'/'拼接参数）：get('blog/get/'+id)；URL最终形式：baseURL/blog/get/1
 * 调用方式2（使用'?'拼接参数）：get('blog/get',{id})；URL最终形式：baseURL/blog/get?id=1；
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const get = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service.get(url, {
            params: params,
            ...config
        })
            .then(resp => {
                resolve(resp)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装get请求, 将数据放到query中；
 * 后端借口的请求方式通过 @GetMapping() 配置， 可以通过对象、 @param()、 直接获取参数；
 * 使用范例：
 * 前台传递参数：{id:1}
 * @GetMapping("/list")
 * public List < Student > list(Student student)
 * public List < Student > list(@RequestParam("id") Integer studentId)
 * public List < Student > list(Integer id)
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const proGet = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service
            .get(url, {
                params: params,
                ...config
            })
            .then(resp => {
                resolve(resp)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const post = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service
            .post(url, params, config)
            .then(
                resp => {
                    resolve(resp)
                },
                error => {
                    reject(error)
                })
    })
}

/**
 * 封装put请求
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const put = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service
            .put(url, params, config)
            .then(resp => {
                resolve(resp)
            })
            .catch(error => {
                reject(error)
            })
    })
}

/**
 * 封装delete请求
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const del = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service
            .delete(url, {
                params: params,
                ...config
            })
            .then(resp => {
                resolve(resp)
            })
            .catch(error => {
                reject(error)
            })

    })
}

/**
 * 封装patch请求
 * patch请求： 对比put请求
 * @param url
 * @param params
 * @param config
 * @returns {Promise<unknown>}
 */
export const patch = (url, params = {}, config = {}) => {
    return new Promise((resolve, reject) => {
        service
            .patch(url, params, config)
            .then(resp => {
                resolve(resp)
            })
            .catch(error => {
                reject(error)
            })
    })
}

//endregion axios封装
