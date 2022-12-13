import './RightMenu.css'
import React, {Component, createRef} from 'react';
import {Button, Col, Form, Input, message, Modal, Radio, Row, Select, TreeSelect} from "antd";
import TextArea from "antd/es/input/TextArea";
import {sysPage, sysPerm} from "@/server";
import * as PropTypes from "prop-types";


//region主组件内用于的消息总线
const RightMenuContext = React.createContext();

//endregion主组件内用于的消息总线

/**
 * todo 将此组件抽取为可复用的组件
 */
class RightMenu extends Component {
    modelEle = createRef("rightMenuFormMordelEle")
    formEle = createRef("rightMenuFormEle")
    state = {
        formEleObj: undefined,
        menuTitle: '右键菜单标题',
        currentElement: "menu",//取值：menu,page
        formConfig: {
            formVisible: false,
            status: "createMenu",//createMenu,updateMenu,updatePage,createPage
            title: {
                "updateMenu": '编辑菜单',
                "updatePage": '编辑页面',
                "createMenu": '新建菜单',
                "createPage": '添加页面',
            },
            initData: {},
            options: {
                pages: [],
                perms: []
            }
        },
        definition: {
            id: undefined,//page的id
            path: undefined,//page的路径
            parentId: undefined,//父级菜单的id
            title: undefined,//页面的名称
            filePath: undefined,//页面文件的路径
            description: undefined,//描述
            locked: undefined,//描述
            weights: undefined,//描述
        },

        //右键菜单的样式
        menuStyle: {
            zIndex: 2,
            opacity: 1,//透明度
            position: 'absolute',
            left: `0px`,
            top: `0px`,
            visibility: "hidden",
        }
    };


    showModal = async (event, info) => {
        /**
         父级节点{
         0：顶级节点;
         正数：父节点id；
         -1：非菜单页}
         */
        let respPage = await sysPage.getMenuCrude()
        let respPerm = await sysPerm.getSysPermList();
        const {formConfig} = this.state
        let pageOption = respPage.data.filter(p => {
            return p.parentId === 0
        }).map(p => {
            return {id: p.id, title: p.title}
        })

        pageOption.unshift({id: 0, title: "无"})

        let permOption = respPerm.data.map(p => {
            return {id: p.id, permission: p.permission}
        })

        //todo respPerm
        let newFormConfig = {...formConfig, options: {...formConfig.options, pages: pageOption, perms: permOption}}
        this.setState({formConfig: newFormConfig})

        if (info.parentId === 0) {
            this.setState({currentElement: "menu"})
        }
        if (info.parentId > 0) {
            this.setState({currentElement: "page"})
        }
        let {menuStyle} = this.state;
        //以 鼠标位置 为基准点，向左偏移40px，向上偏移40px
        menuStyle = {
            ...menuStyle,
            left: `${event.clientX + 40}px`,
            top: `${event.clientY - 20}px`,
            visibility: "visible"
        }
        this.setState({definition: info, menuStyle, menuTitle: info.title})
    };

    //隐藏菜单
    hideMenu = (e) => {
        this.setState({menuStyle: {...this.state.menuStyle, visibility: "hidden"}})
    }

    //todo 第一级 菜单 第二级 页面 第三级别（叶子节点） 权限   https://3x.ant.design/components/tree-cn/
    preCreateMenuAction = (item, statusInfo) => {
        this.setState({
            formConfig: {
                ...this.state.formConfig,
                formVisible: true,
                status: "createMenu",
                initData: {...this.state.formConfig.initData, parentId: 0}
            }
        })
    }
    preCreatePageAction = (item, statusInfo) => {
        this.setState({
            formConfig: {
                ...this.state.formConfig,
                formVisible: true,
                status: "createPage",
                initData: {parentId: item.id}
            }
        })
    }

    preEditAction = (item, statusInfo) => {
        /*
description: "用于管理员对系统进行相关配置"
filePath: "@/containers/views/Home/home"
id: 4
locked: false
parentId: 0
path: "/admin/sys"
perms: []
title: "系统模块"
weights: 99
        * */
        this.setState({
            formConfig: {
                ...this.state.formConfig,
                formVisible: true,
                status: statusInfo.status,
                initData: {...item}
            }
        })
    }

    preDeleteAction = (item) => {
        Modal.confirm({
            title: '真的要删除页面 ' + item.title + ' 吗?',
            // content: 'When clicked the OK button, this dialog will be closed after 1 second',
            async onOk() {
                try {
                    await sysPage.deleteSysPage({id: item.id});
                    message.success(`页面'${item.title}'已删除`)
                } catch (e) {
                    message.warn(`删除页面'${item.title}'失败`)
                }
            },
            onCancel() {
            },
            okText: "是",
            cancelText: "否",
        })
    }

    componentDidMount() {
        document.addEventListener("click", this.hideMenu)
    }

    handleOk = () => {
        let {formConfig: {status}} = this.state
        this.formEle.current.validateFields(async (err, values) => {
            try {
                if (!err) {
                    if (status === "createMenu" || status === "createPage") {
                        await sysPage.saveSysPage(values);
                        message.success("操作成功!")
                    } else if (status === "updateMenu" || status === "updatePage") {
                        await sysPage.updateSysPage(values);
                        message.success("操作成功!")
                    } else {
                        message.warn("未知的表单状态")
                        return
                    }
                    this.setState(
                        {formConfig: {...this.state.formConfig, formVisible: false}},
                        () => {
                        }
                    )
                }
            } catch (e) {
                console.log("RightMenu.jsx异常", e)
            }
        })
    }

    handleCancel = () => {
        this.formEle.current.resetFields()
        this.setState(
            {formConfig: {...this.state.formConfig, formVisible: false}}
        )
    }


    componentWillUnmount() {
        document.removeEventListener("click", this.hideMenu)
    }

    render() {
        const {definition, menuStyle, formConfig} = this.state
        let {status, title} = formConfig
        let menuLevelStyle = {display: this.state.currentElement === "menu" ? "" : "none"};
        let pageLevelStyle = {display: this.state.currentElement === "page" ? "" : "none"};
        return (
            <RightMenuContext.Provider value={{...this.state}}>
                <div style={menuStyle}>
                    <span>`{this.state.menuTitle}`</span>
                    <ul className="right-menu">
                        {/*
                        pageX: '',//x-坐标
                        pageY: '',//y-坐标
                        id: '',//page的id
                        path: '',//page的路径
                        parentId: '',//父级菜单的id
                        categoryName: '',//页面的名称
                    */}
                        <li key={'aaaaa2'} style={menuLevelStyle}
                            onClick={() => {
                                this.preCreatePageAction(definition, {status: "createPage", formVisible: true})
                            }}>添加页面</li>
                        <li key={'bbbbb2'} style={pageLevelStyle}
                            onClick={() => {
                                this.preEditAction(definition, {status: "updatePage", formVisible: true})
                            }}>修改页面</li>

                        <li key={'ccccc2'} style={pageLevelStyle}
                            onClick={() => {
                                this.preDeleteAction(definition)
                            }}>删除页面</li>
                        <li key={'aaaaa'} style={menuLevelStyle}
                            onClick={() => {
                                this.preCreateMenuAction(definition, {status: "createMenu", formVisible: true})
                            }}>添加菜单</li>
                        <li key={'bbbbb'} style={menuLevelStyle}
                            onClick={() => {
                                this.preEditAction(definition, {status: "updateMenu", formVisible: true})
                            }}>修改菜单</li>

                        <li key={'ccccc'} style={menuLevelStyle}
                            onClick={() => {
                                this.preDeleteAction(definition)
                            }}>删除菜单</li>

                    </ul>
                </div>
                <Modal
                    ref={this.modelEle}
                    title={title[status]}
                    visible={this.state.formConfig.formVisible}
                    onCancel={this.handleCancel}

                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            取 消
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk} className="login-form-button">
                            确 认
                        </Button>,
                    ]}
                >
                    <NormalMenuForm formConfig ref={this.formEle}/>
                </Modal>
            </RightMenuContext.Provider>
        );
    }
}


function Option(props) {
    return null;
}

Option.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.node
};

@Form.create()
class NormalMenuForm extends Component {
    static contextType = RightMenuContext;
    /*
    todo consumer 表单的status
    */

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };


    render() {
        //perms
        const {getFieldDecorator} = this.props.form;
        let treeSelectSettings = (context) => {
            let {perms} = context.formConfig.options
            let treeData = perms.map(p => {
                // { title: 'Node1',value: '0-0',key: '0-0', children: [{title: 'Child Node1',value: '0-0-0',key: '0-0-0',},],},
                return {title: p.permission, value: p.id, key: p.id,}
            })
            const treeProps = {
                treeData,
                // value: this.state.value,
                // onChange: this.onChange,
                treeCheckable: true,
                showCheckedStrategy: TreeSelect.SHOW_PARENT,
                searchPlaceholder: 'Please select',
                style: {
                    width: '100%',
                },
            };
            return <TreeSelect {...treeProps} />
        }


        return (
            <RightMenuContext.Consumer>
                {(context) => {
                    let {formConfig: { options, status, initData}} = context
                    return <Form layout="vertical">
                        <Form.Item label={`ID`} style={{display: "none"}}>
                            {getFieldDecorator(`id`, {
                                rules: [
                                    {required: false, message: '页面id',},
                                ],
                                initialValue: initData['id'] ? initData['id'] : undefined
                            })(<Input placeholder="请输入页面id！" allowClear={true}/>)}
                        </Form.Item>
                        <Row>
                            <Col span={11}>
                                <Form.Item label={`父级页面`}>
                                    {getFieldDecorator(`parentId`, {
                                        rules: [
                                            {required: true, message: '请选择父级页面',},
                                        ],
                                        initialValue: initData['parentId'] ? initData['parentId'] : 0
                                    })(<Select disabled={status === "createMenu" || status === "updateMenu"}
                                               placeholder="请选择父级页面！" optionLabelProp="label">
                                        {
                                            options.pages.map(o => {
                                                return <Select.Option key={o.id + "page"} value={o.id} label={o.title}>
                                                    {o.title}
                                                </Select.Option>
                                            })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={11} offset={2}>
                                <Form.Item label={`名称`}>
                                    {getFieldDecorator(`title`, {
                                        rules: [
                                            {required: true, message: '请输入菜单/页面名称',},
                                        ],
                                        initialValue: initData['title'] ? initData['title'] : undefined
                                    })(<Input placeholder="请输入页面名称！" allowClear={true}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item label={`URL`}>
                                    {getFieldDecorator(`path`, {
                                        rules: [
                                            {required: true, message: '请配置访问路径',},
                                        ],
                                        initialValue: initData['path'] ? initData['path'] : '/admin'
                                    })(<Input placeholder="请配置访问路径！" allowClear={true}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Item label={`组件路径`}>
                                {getFieldDecorator(`filePath`, {
                                    rules: [
                                        {required: true, message: '请输入页面组件的路径',},
                                    ],
                                    initialValue: initData['filePath'] ? initData['filePath'] : '@/containers/views'
                                })(<Input placeholder="请输入页面组件的路径！" allowClear={true}/>)}
                            </Form.Item>
                        </Row>
                        <Row style={{display: status === "createPage" || status === "updatePage" ? "" : "none"}}>
                            <Form.Item label={`所需权限`}>
                                {getFieldDecorator(`perms`, {
                                    rules: [
                                        {required: false, message: '访问菜单/页面所需权限',},
                                    ],
                                    initialValue: initData['perms'] ? initData['perms'] : []
                                    // })(<Select mode="multiple" placeholder="访问页面所需权限！" allowClear={true}/>)}
                                })(treeSelectSettings(context))}
                            </Form.Item>
                        </Row>
                        <Row>
                            <Col span={11}>
                                <Form.Item label={`权重`}>
                                    {getFieldDecorator(`weights`, {
                                        rules: [
                                            {required: true, message: '页面权重',},
                                        ],
                                        initialValue: initData['weights'] ? initData['weights'] : 99
                                    })(<Input placeholder="控制页面的顺序！" allowClear={true}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={11} offset={2}>
                                <Form.Item label="状态">
                                    {getFieldDecorator('locked', {
                                        initialValue: initData['locked'] ? initData['locked'] : false
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
                                        initialValue: initData['description'] ? initData['description'] : ""
                                    })(<TextArea style={{width: "100%"}} rows={3}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                }}

            </RightMenuContext.Consumer>
        )
    }
}

export default RightMenu
