/*
	汇总所有的reducer为一个总的reducer
*/
import {user} from "./user";
import {cache} from "./cache";


//汇总所有的reducer变为一个总的reducer
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    cache,//内部缓存
    user
}
