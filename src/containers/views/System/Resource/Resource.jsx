import React, {Component, createRef} from 'react';
import {connect} from "react-redux";
import {Button, Col, Form, Icon, Input, Radio, Row, Tabs, Tree} from "antd";


import {sysPerm} from "@/server";
import {saveInCache} from "@/service/redux/action/cache";
import Permission from "@/containers/views/System/Resource/Permission";
import RightMenu from "@/components/RightMenu/RightMenu";

import './Resource.css'
import TextArea from "antd/es/input/TextArea";

const {TreeNode} = Tree;
const {TabPane} = Tabs;


function callback(key) {
    console.log("callback", key);
}


@connect(state => ({cache: state.cache}), {saveInCache})
@Form.create()
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
        const {form: {getFieldDecorator}} = this.props
        return (
            <div>
                <Tabs defaultActiveKey="2" onChange={callback} animated={false}>
                    <TabPane tab="页面管理" key="2">
                        新建页面：为页面添加、编辑相应的资源权限
                        {/*region*/}
                        <Form layout="vertical">
                            <Form.Item label={`ID`} style={{visibility: 'hidden'}}>
                                {getFieldDecorator(`id`, {
                                    rules: [
                                        {required: false, message: '主键',},
                                    ],
                                })(<Input placeholder="请输入id！" allowClear={true}/>)}
                            </Form.Item>
                            <Row>
                                <Col span={11}>
                                    <Form.Item label={`父级页面`}>
                                        {getFieldDecorator(`parentId`, {
                                            rules: [
                                                {required: true, message: '请选择父级页面',},
                                            ],
                                        })(<Input placeholder="请选择父级页面！" allowClear={true}/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={11} offset={2}>
                                    <Form.Item label={`页面名称`}>
                                        {getFieldDecorator(`title`, {
                                            rules: [
                                                {required: true, message: '请输入页面名称',},
                                            ],
                                        })(<Input placeholder="请输入页面名称！" allowClear={true}/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label={`URL`}>
                                        {getFieldDecorator(`path`, {
                                            rules: [
                                                {required: true, message: '请输入页面路径',},
                                            ],
                                        })(<Input placeholder="请输入页面路径！" allowClear={true}/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Form.Item label={`组件路径`}>
                                    {getFieldDecorator(`file_path`, {
                                        rules: [
                                            {required: true, message: '请输入页面组件的路径',},
                                        ],
                                    })(<Input placeholder="请输入页面组件的路径！" allowClear={true}/>)}
                                </Form.Item>
                            </Row>
                            <Row>
                                <Col span={11}>
                                    <Form.Item label={`权重`}>
                                        {getFieldDecorator(`weights`, {
                                            rules: [
                                                {required: true, message: '请输入页面组件的路径',},
                                            ],
                                        })(<Input placeholder="请输入页面组件的路径！" allowClear={true}/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={11} offset={2}>
                                    <Form.Item label="状态">
                                        {getFieldDecorator('locked', {
                                            initialValue: false,
                                        })(
                                            <Radio.Group>
                                                <Radio value={false}>正常</Radio>
                                                <Radio value={true}>锁定</Radio>
                                            </Radio.Group>,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="描述">
                                        {getFieldDecorator('description', {
                                            rules: [{required: false, message: '请输入角色描述!'}],
                                        })(<TextArea style={{width: "100%"}} rows={3}/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        {/*endregion*/}
                        {/*region 树形菜单*/}
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
                        {/*endregion*/}

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
