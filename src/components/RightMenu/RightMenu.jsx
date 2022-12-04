import './RightMenu.css'
import React, {Component, createRef} from 'react';
import {Button, Col, Form, Input, Row} from "antd";

/**
 * todo 将此组件抽取为可复用的组件
 */
class RightMenu extends Component {
    formEle = createRef("rightMenuFormEle")
    state = {
        menuTitle: '右键菜单标题',

        definition: {
            id: undefined,//page的id
            path: undefined,//page的路径
            parentId: undefined,//父级菜单的id
            categoryName: undefined,//页面的名称
        },

        //右键菜单的样式
        menuStyle: {
            zIndex: 2,
            opacity: 0.9,
            position: 'absolute',
            left: `0px`,
            top: `0px`,
            visibility: "hidden",
        }
    };


    showModal = (event, info) => {
        console.log("indo:", info, "showModal++++++++++event:", event)
        let {menuStyle} = this.state
        //以 鼠标位置 为基准点，向左偏移40px，向上偏移40px
        menuStyle = {
            ...menuStyle,
            left: `${event.clientX + 40}px`,
            top: `${event.clientY - 20}px`,
            visibility: "visible"
        }
        this.setState({definition: info, menuStyle, menuTitle: info.categoryName})
    };

    //隐藏菜单
    hideMenu = (e) => {
        this.setState({menuStyle: {...this.state.menuStyle, visibility: "hidden"}})
    }

    preCreateAction = (item) => {
        console.log("preCreateAction:", item)
        // this.formEle.current.showFormVisible
        console.log('this.formEle.current', this.formEle.current.showFormVisible)
    }

    preEditAction = (item) => {
        console.log("preEditAction:", item)
        this.setState({
            formConfig: {
                formVisible: true, status: 'update',
            }
        })
    }

    preDeleteAction = (item) => {
        console.log("preDeleteAction:", item)
        this.setState({
            formConfig: {
                formVisible: true, status: 'delete',
            }
        })
    }

    componentDidMount() {
        document.addEventListener("click", this.hideMenu)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.hideMenu)
    }

    render() {
        const {definition, menuStyle, formConfig} = this.state
        return (
            <>
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
                        <li key={'aaaaa'} onClick={() => {
                            this.preCreateAction(definition)
                        }}>添加子菜单{definition.id}</li>
                        <li key={'bbbbb'} onClick={() => {
                            this.preEditAction(definition)
                        }}>级联删除{definition.id}</li>
                        <li key={'ccccc'} onClick={() => {
                            this.preDeleteAction(definition)
                        }}>修改{definition.id}{definition.path}{definition.parentId}</li>
                    </ul>
                </div>
                <NormalMenuForm ref={this.formEle} formConfig/>
            </>
        );
    }
}


@Form.create()
class NormalMenuForm extends Component {
    state = {
        formConfig: {
            formVisible: false,
            status: 'update',
            title: {
                "update": '编辑',
                "create": '新增',
            },
        },
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    showFormVisible() {
        return () => {
            console.log('.......................................')
            this.setState(
                {formConfig: {formVisible: true}}
            )
        }
    }

    hideFormVisible = () => {
        this.setState(
            {formConfig: {formVisible: false}}
        )
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {formConfig: {formVisible}} = this.state;
        return (
            <Form style={{visibility: formVisible ? "visible" : "hidden"}} onSubmit={this.handleSubmit}
                  className="login-form">
                <Form.Item label={`页面ID`}>
                    {getFieldDecorator('id', {
                        rules: [{required: true, message: '缺少页面id!'}],
                    })(
                        <Input
                            placeholder="页面id"
                        />,
                    )}
                </Form.Item>
                <Row>
                    {/*0：顶级页面*/}
                    {/*-1：非菜单页面*/}
                    {/*-1：非菜单页面*/}
                    <Col span={12}> <Form.Item label={`父级页面`}>
                        {getFieldDecorator('parent_id', {
                            rules: [{required: false, message: '请选择父级页面!'}],
                        })(
                            <Input
                                placeholder="父级页面id"
                            />,
                        )}
                    </Form.Item></Col>
                    <Col span={12}> <Form.Item label={`页面名称`}>
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: '请输入页面名称!'}],
                        })(
                            <Input
                                placeholder="名称"
                            />,
                        )}
                    </Form.Item> </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item label={`访问路径`}>
                            {getFieldDecorator('path', {
                                rules: [{required: false, message: '请配置访问路径!'}],
                            })(
                                <Input
                                    placeholder="页面路径"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={`权重`}>
                            {getFieldDecorator('weights', {
                                rules: [{required: false, message: '页面权重!'}],
                                init: {
                                    default: 999
                                }
                            })(
                                <Input
                                    placeholder="控制页面的顺序"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label={`描述`}>
                    {getFieldDecorator('description', {
                        rules: [{required: false, message: '请描述页面功能!'}],
                    })(
                        <Input.TextArea
                            placeholder="描述"
                        >
                        </Input.TextArea>
                    )}
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        确认
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default RightMenu
