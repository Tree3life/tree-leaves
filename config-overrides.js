/**
 * 本文件用于在不使用npm run eject 命令的情况下改写web pack的配置
 */
const {override, fixBabelImports, addLessLoader, addDecoratorsLegacy, addWebpackAlias} = require('customize-cra');
const path = require('path')
const resolve = dir => path.join(__dirname, '.', dir)
module.exports = override(
    // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,//自动打包相关的样式 默认为 style:'css'
    }),
    // // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
    // addLessLoader({
    //     javascriptEnabled: true,
    //     modifyVars:{'@primary-color':'#1DA57A'},
    // }),
    //添加装饰器语法
    addDecoratorsLegacy(),
    addWebpackAlias({
        ['@']: resolve('src'),
        // ["~"]: path.resolve("src/../public")
        // ["aliasSource"]: path.resolve("../src")
    }),
);
