import React, {Component, createRef} from 'react';
import {connect} from "react-redux";
import {Button, Icon, Tabs, Tree} from "antd";

import {sysPerm} from "@/server";
import {saveInCache} from "@/service/redux/action/cache";
import Permission from "@/containers/views/System/Resource/Permission";
import RightMenu from "@/components/RightMenu/RightMenu";

import './Resource.css'

const {TreeNode} = Tree;
const {TabPane} = Tabs;


function callback(key) {
    console.log("callback", key);
}


@connect(state => ({cache: state.cache}), {saveInCache})
class Resource extends Component {
    editMenuEle = createRef();

    constructor() {
        super();
        this.state = {
            checkedKeys: [],
            selectedKeys: [],
            autoExpandParent: true,
        }
    }

    handleCheck = (checkedKeys, info) => {
        this.setState({checkedKeys})
        console.log('handleCheck///////', checkedKeys)
        console.log('===========', info)
    }

    createMenuTree = (elements) => {
        return elements.map(data => {
            if (data.children && data.children.length > 0) {
                return <TreeNode disabled={false} icon={<Icon type="folder-open"/>} title={data.label}
                                 id={data.id}
                                 parentId={data.parentId} key={data.key}>
                    {this.createMenuTree(data.children)}
                </TreeNode>
            } else {
                return <TreeNode disabled={false}
                                 icon={({parentId}) => {
                                     if (parentId === 0) {//父级菜单
                                         return <Icon type={'folder-open'}/>
                                     } else {
                                         return <Icon type={'file'}/>
                                     }
                                 }}
                                 parentId={data.parentId}
                                 id={data.id}
                                 title={data.label}
                                 key={data.key}/>
            }
        })
    }


    refresh = () => {
        sysPerm.reloadSysPerm()
    }

    doExpand = (expandedKeys) => {
        console.log("doExpand", expandedKeys)
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    handleRightClick = (params) => {
        const {event, node} = params
        console.log("handleRightClickxxxxxxxxxxxxxxxx event:", event, "node:", node)
        this.editMenuEle.current.showModal(event,
            //传递必须的菜单信息
            {
                id: node.props['id'],//page的id
                path: node.props['eventKey'],//page的路径
                parentId: node.props['parentId'],//父级菜单的id
                categoryName: node.props['title'],//页面的名称
            })
    }


    render() {
        return (
            <div>
                <Tabs defaultActiveKey="2" onChange={callback} animated={false}>
                    <TabPane tab="页面管理" key="2">
                        新建页面：为页面添加、编辑相应的资源权限
                        <Tree
                            onExpand={this.doExpand}
                            expandedKeys={this.state.expandedKeys}
                            autoExpandParent={this.state.autoExpandParent}
                            checkable
                            onCheck={this.handleCheck}
                            checkedKeys={this.state.checkedKeys}
                            // onSelect={this.handleMenu}
                            selectedKeys={this.state.selectedKeys}
                            showIcon
                            defaultExpandAll
                            switcherIcon={<Icon type="down"/>}
                            onRightClick={this.handleRightClick}
                        >
                            {
                                this.props.cache.menus ?
                                    this.createMenuTree(this.props.cache.menus)
                                    : <span>暂无数据</span>
                            }
                        </Tree>
                    </TabPane>
                    <TabPane tab="权限管理" key="1">
                        <Button onClick={this.refresh}>刷新</Button>
                        配置接口的权限
                        <Permission/>
                    </TabPane>

                    <TabPane tab="Tab 3" key="3">
                        1.配置用户所拥有的角色<br/>
                        2.配置角色所能访问的页面<br/>
                        3.配置页面所需要的权限<br/>
                        4.新增页面，删除页面，编辑页面信息
                    </TabPane>
                </Tabs>
                <RightMenu ref={this.editMenuEle}/>
                {/*<NormalMenuForm/>*/}
            </div>
        );
    }
}


export default Resource;
