export default function generateMenu(pagesList) {
    return pagesList.filter(item => {
        //内层循环生成子级菜单
        let firstProcess = pagesList.filter(meta => {
            return meta.parentId === item.id
        }).sort((curt, next) => {
            return curt.weights - next.weights
        })
        item.children = firstProcess
        return item.parentId === 0
    }).sort((curt, next) => curt.weights - next.weights).map(item => {
        return getMenuItem(item)
    })
}

//统一出口；递归方法的调用操作     应当放在满足递归条件的分支下
function getMenuItem(item) {
    if (item.children && item.children.length > 0) {
        item.children = item.children.map(i => {
            return getMenuItem(i)
        })
    }

    let hasChildren = !item.children || item.children.length === 0
    return {
        ...item,
        key: item.path,
        icon: item.icon ? null : null,
        children: hasChildren ? undefined : item.children,
        label: item.title,
        type: null,
    }
}
