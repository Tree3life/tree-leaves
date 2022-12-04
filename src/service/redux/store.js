/**
 * 本文件用于暴露一个store对象，整个应用只有一个store对象
 */
//createStore: 创建redux中最为核心的store对象；combineReducers：汇总多个reducer
import {createStore, applyMiddleware, combineReducers} from 'redux'
//redux-thunk: 支持异步action
import thunk from 'redux-thunk'
//redux-persist: 持久化store中的信息（刷新页面后依然存在）；
import {persistStore, persistReducer} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'//使用sessionStorage存储
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {composeWithDevTools} from 'redux-devtools-extension'//开发工具

import states from './states'


//汇总所有的reducer（实质上是states）为一个总的reducer
const reducer = combineReducers(states);

//region redux持久化配置
//定义配置的信息
const persisConfig = {
    key: "root",
    storage: sessionStorage,//存储引擎
    // 黑名单: 设置不参与持久化的state的键值
    blacklist: ['不想缓存的信息的key'],// navigation will not be persisted
    // whitelist: ['navigation'] // only navigation will be persisted
    // stateReconciler: autoMergeLevel2  // 查看 'Merge Process' 部分的具体情况
}
//创建持久化的配置persist的信息
const persist_reducers = persistReducer(persisConfig, reducer);


//创建存储对象并且抛出对象
const store = createStore(persist_reducers, composeWithDevTools(applyMiddleware(thunk)));
//使用persistStore包裹一下
export const persistor = persistStore(store);
//endregion
export default store


/**同时使用local storage和session storage
 import reducers from './reducer';
 import { persistStore, persistReducer } from 'redux-persist';
 import storage from 'redux-persist/lib/storage';
 import sessionStorage from 'redux-persist/lib/storage/session'
 import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

 const rootPersistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['auth'],
  stateReconciler: autoMergeLevel2
};

 const authPersistConfig = {
  key: 'auth',
  storage: sessionStorage,
}

 const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  other: otherReducer,
})

 export default persistReducer(rootPersistConfig, rootReducer)
 */
