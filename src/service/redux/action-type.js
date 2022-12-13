/*
	该模块是用于定义action对象中type类型的常量值，目的：便于管理的同时防止单词写错
*/
export default Object.freeze({
    saveInCache: Symbol("将后端共享的固定常量信息写入缓存"),
    getCachedRoleOptions: Symbol("获取缓存的角色信息"),
    /**
     * 用户信息相关
     */
    tempStorageUserInfo: Symbol('暂存用户信息'),
    userLogin: Symbol('用户登录'),

    /**
     * 系统信息相关
     */
    saveMenuList: Symbol('缓存菜单信息'),
    savePermissionInfo: Symbol('缓存权限信息'),

    sendMessage: '发送websocket消息',
    parseMessage: '解析websocket消息'
    // LoginRequestMessage: 0,
    // LoginResponseMessage: 1,
    // ChatRequestMessage: 2,
    // ChatResponseMessage: 3,
    // GroupCreateRequestMessage: 4,
    // GroupCreateResponseMessage: 5,
    // GroupJoinRequestMessage: 6,
    // GroupJoinResponseMessage: 7,
    // GroupQuitRequestMessage: 8,
    // GroupQuitResponseMessage: 9,
    // GroupChatRequestMessage: 10,
    // GroupChatResponseMessage: 11,
    // GroupMembersRequestMessage: 12,
    // GroupMembersResponseMessage: 13,
    // PingMessage: 14,
    // PongMessage: 15,
    // RPC_MESSAGE_TYPE_REQUEST: 101,//请求类型 byte 值
    // RPC_MESSAGE_TYPE_RESPONSE: 102,//响应类型 byte 值
    // PrivateChat: Symbol("单聊"),
    // GroupChat: Symbol("群聊"),
    // Broadcast: Symbol("广播"),
    // BuildAGroup: Symbol("建群"),
    // WithdrawFromTheGroup: Symbol("退群"),
})
