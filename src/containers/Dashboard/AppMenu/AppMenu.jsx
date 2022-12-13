import React, {Component} from 'react';
import {Icon, Menu, message} from 'antd';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {saveInCache} from "@/service/redux/action/cache";
import generateMenu from "@/util/menuHelper";


const {SubMenu, Item} = Menu;

@connect(state => ({cache: state.cache}), {saveInCache})
class AppMenu extends Component {
    // submenu keys of first level
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    state = {
        openKeys: ['sys'],
        menus: []
    };

    componentDidMount() {
        try {

            const {cache} = this.props
            let crude = cache.pages
            //菜单
            this.setState({
                menus: generateMenu(crude)
            }, () => {//页面更新后，缓存菜单
                this.props.saveInCache({menus: this.state.menus})
            })

        } catch (e) {
            message.warn(e)
        }
    }

    onOpenChange = openKeys => {
        console.log(openKeys, "onOpenChange:openKeys")
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    selectMenu = (args) => {
        const {keyPath} = args
        // let parentPath = keyPath[0]
        let path = '/admin'
        keyPath.reverse().forEach(item => path += '/' + item)
        console.log("yyyyyyyyyyy", path, args)
    }

    //统一出口；递归方法的调用操作     应当放在满足递归条件的分支下
    getMenuItem = (item) => {
        if (item.children && item.children.length > 0) {
            item.children = item.children.map(i => {
                return this.getMenuItem(i)
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


    createMenu(menuList) {

        return menuList.map(item => {
            //非叶子节点
            if (item.children && item.children.length > 0) {
                return (
                    <SubMenu key={item.key} title={<span> <Icon type="setting"/> <span>{item.label}</span> </span>}>
                        {this.createMenu(item.children)}
                    </SubMenu>
                )
            } else {//item的children为undefined,即 叶子节点
                return (
                    <Item key={item.key}>
                        <Link to={item.key}>
                            <span>{item.label}</span>
                        </Link>
                    </Item>
                )
            }
        })

    }

    render() {
        const {menus: menuList} = this.state
        // this.
        return (
            <Menu mode="inline" openKeys={this.state.openKeys} onOpenChange={this.onOpenChange}
                  onClick={this.selectMenu}>
                {/*递归动态生成菜单*/}
                {
                    this.createMenu(menuList)
                }
            </Menu>
        );
    }
}

export default AppMenu;
