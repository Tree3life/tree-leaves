import React, {Component} from 'react';
import {user, sysRole} from "@/server";

import {Col, Form, Input, InputNumber, Radio, Row, Select, Tag} from "antd";
import CRUDPage from "@/components/CRUDPage/CRUDPage";
import {connect} from "react-redux";
import {saveInCache} from "@/service/redux/action/cache";

@connect(state => ({cache: state.cache}), {saveInCache})
class User extends Component {


    async componentDidMount() {
        //todo 查询角色进行选项的初始化
        //    $formOptions .roles

        let resp = await sysRole.getSysRoleList();
        let roles = resp.data
        // this.props.saveInCache({"$formOptions":{"roles": roles}})
        //todo 解决此处使用saveInCache一直发送请求的bug
        // this.props.saveInCache({
        //     // "formOptions":resp.data,
        //     // roles: resp.data.roles,//用户拥有的角色
        // })

        //todo 解决编辑后前端报错异常
        localStorage.setItem("$formOptions", JSON.stringify({"roles": roles}))
    }

    /**
     * 条件查询的布局
     * @returns {function(*)}
     */
    queryFormLayout() {
        return (form) => {
            const {getFieldDecorator} = form
            return (
                <>
                    <Col span={6}>
                        <Form.Item label={`昵称`}>
                            {getFieldDecorator(`username`, {
                                rules: [
                                    {required: false, message: '请输入用户名!',},
                                ],
                            })(<Input placeholder="请输入！" allowClear={true}/>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label={`姓名`}>
                            {getFieldDecorator(`name`, {
                                rules: [
                                    {required: false, message: '请输入姓名!',},
                                ],
                            })(<Input placeholder="请输入！" allowClear={true}/>)}
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label={`状态`}>
                            {getFieldDecorator(`locked`, {
                                rules: [
                                    {required: false, message: '请选择状态!',},
                                ],
                            })(<Radio.Group>
                                <Radio value={false}>正常</Radio>
                                <Radio value={true}>锁定</Radio>
                            </Radio.Group>,)}
                        </Form.Item>
                    </Col>
                </>
            )
        }
    }


    /**
     * 表格列配置
     * @returns {function(*)}
     */
    tableColumns() {
        const {cache: {$formOptions}} = this.props
        return (columns) => {
            //添加列
            columns.push({title: '昵称', dataIndex: 'username', editable: true,});
            columns.push({title: '姓名', dataIndex: 'name', editable: true,});
            columns.push({title: '性别', dataIndex: 'gender', editable: true,});
            columns.push({title: '年龄', dataIndex: 'age', editable: true,});
            columns.push({
                title: '状态', dataIndex: 'locked', editable: true,
                render: item => (<Tag color={item ? 'geekblue' : 'green'}>{item ? '锁定' : '正常'}</Tag>),
            });
            columns.push({
                title: '角色', dataIndex: 'roles', editable: true,
                render: roles => {
                    let result = "";
                    if (roles) {
                        result = roles.map(item => {
                            if (!item.id) {
                                item = $formOptions.roles.find(e => {
                                    return e.id === item
                                })
                            }
                            return <Tag key={item.id + '' + item.key}>{item.role}</Tag>;
                        })
                    }
                    return result;
                },
            })
        }
    }

    /**
     * 添加表单的配置
     * @returns {function(*)}
     */
    saveFormLayout() {
        const {cache: {$formOptions: {roles}}} = this.props

        const handleChange = (value) => {
            console.log(`selected ${value}`);
        }

        return (form, component) => {
            const {state: {confirmDirty}} = component
            const {getFieldDecorator} = form

            //确认密码
            const handleConfirmBlur = (e) => {
                const {value} = e.target;
                component.setState({confirmDirty: component.state.confirmDirty || !!value})
            }

            //密码校验
            const validateToNextPassword = (rule, value, callback) => {
                if (value && confirmDirty) {
                    form.validateFields(['confirm'], {force: true});
                }
                callback();
            };

            //确认密码校验
            const compareToFirstPassword = (rule, value, callback) => {
                if (value && value !== form.getFieldValue('password')) {
                    callback('密码不一致!');
                } else {
                    callback();
                }
            };

            return (
                <>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="用户名">
                                {getFieldDecorator('username', {
                                    rules: [{required: true, message: '请输入用户名!'}],
                                })(<Input/>)}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="姓名">
                                {getFieldDecorator('name', {
                                    rules: [{required: true, message: '请输入姓名!'}],
                                })(<Input/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <Form.Item label="性别">
                                {getFieldDecorator('gender', {
                                    rules: [{required: false, message: '请输入性别!'}],
                                    initialValue: '男',
                                })(<Radio.Group>
                                    <Radio value={'男'}>男</Radio>
                                    <Radio value={'女'}>女</Radio>
                                    <Radio value={'不明'}>不明</Radio>
                                </Radio.Group>,)}
                            </Form.Item>
                        </Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="年龄">
                                {getFieldDecorator('age', {
                                    rules: [{required: false, message: '请输入年龄!'}],
                                })(<InputNumber
                                    min={0} max={150}
                                    style={{width: '100%'}}
                                    // formatter={value => `$ ${value}岁`}
                                    // parser={value => value}
                                />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}> <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入密码!'},
                                    {validator: validateToNextPassword},]
                            })(<Input.Password/>)}
                        </Form.Item></Col>
                        <Col span={11} offset={2}>
                            <Form.Item label="确认密码">
                                {getFieldDecorator('confirm', {
                                    rules: [
                                        {required: true, message: '请重复输入密码!'},
                                        {validator: compareToFirstPassword},
                                    ]
                                })(<Input.Password onBlur={handleConfirmBlur}/>)}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="角色">
                        {getFieldDecorator('roles', {
                            initialValue: [],
                        })(
                            <Select
                                mode="multiple"
                                style={{width: '100%'}}
                                placeholder="请选择角色信息"
                                onChange={handleChange}
                                optionLabelProp="label"
                            >
                                {/* eslint-disable-next-line array-callback-return */}
                                {roles ? roles.map(item => {
                                    return <Select.Option key={item.id} value={item.id}
                                                          label={item.role}>{item.role}</Select.Option>
                                }) : ""}
                            </Select>,
                        )}
                    </Form.Item>
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
                </>)
        }
    }

    editRowConfig() {

        const handleChange = (value) => {
            console.log(`selected ${value}`);
        }

        const {cache: {"$formOptions": {roles}}} = this.props

        return (context, cellProps) => {
            const {
                //字段名即控件的`name`属性
                dataIndex, title, record
            } = cellProps;

            const elementType = () => {
                let component = <Input/>
                //根据输入类型设置控件类型
                if (dataIndex === 'age') {
                    component = <InputNumber/>;
                } else if (dataIndex === 'gender') {
                    component =
                        <Radio.Group>
                            <Radio value={'男'}>男</Radio>
                            <Radio value={'女'}>女</Radio>
                            <Radio value={'不明'}>不明</Radio>
                        </Radio.Group>;
                } else if (dataIndex === 'locked') {
                    component =
                        <Radio.Group>
                            < Radio
                                value={false}> 正常 < /Radio>
                            <Radio value={true}>锁定</Radio>
                        </Radio.Group>;
                } else if (dataIndex === 'roles') {
                    component =
                        <Select
                            mode="multiple"
                            style={{width: '100%'}}
                            placeholder="请选择角色信息"
                            onChange={handleChange}
                            optionLabelProp="label"
                        >
                            {/* eslint-disable-next-line array-callback-return */}
                            {roles ? roles.map(item => {
                                return <Select.Option key={item.id} value={item.id}
                                                      label={item.role}>{item.role}</Select.Option>
                            }) : ""}
                        </Select>
                }
                return component;
            }

            const elementRules = () => {
                let itemRule = [{required: true, message: `请输入 ${title}!`}]
                if (dataIndex === 'username') {
                    itemRule = [{required: true, message: `请输入 ${title}!`}]
                } else if (dataIndex === 'name') {
                    itemRule = [{required: true, message: `请输入 ${title}!`}]
                } else if (dataIndex === 'locked') {
                    itemRule = [{required: true, message: `请输入 ${title}!`}]
                } else if (dataIndex === "roles") {
                    itemRule = [{required: false, message: `请输入 ${title}!`}]
                }
                return itemRule
            }
            const elementInitValue = () => {
                if (dataIndex === 'roles') {
                    let result = '';
                    //role
                    if (record[dataIndex]) {
                        result = record[dataIndex].map(item => {
                            if (!item.id) {
                                item = this.props.cache['$formOptions'].roles.find(e => {
                                    return e.id === item
                                })
                            }
                            return item.id
                        })
                    }
                    return result;
                }
                return record[dataIndex]
            }
            return {elementRules, elementInitValue, elementType, style: {margin: 0}}
        }
    }

    render() {
        return (
            <div>
                <CRUDPage
                    apiSave={user.saveUser}
                    apiUpdate={user.updateUser}
                    apiDelete={user.deleteUser}
                    apiQuery={user.getUserList}
                    primaryKey='id'
                    layoutQueryForm={this.queryFormLayout()}
                    layoutSaveForm={this.saveFormLayout()}
                    layoutEditRowForm={this.editRowConfig()}
                    tableColumnsConfig={this.tableColumns()}
                    saveFormConfig={{title: "用户信息", okText: "确认", cancelText: "取消"}}
                />
            </div>
        );
    }
}

export default User
