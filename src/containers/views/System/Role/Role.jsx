import React, {Component} from 'react';
import moment from 'moment'
import {Col, DatePicker, Form, Input, Radio, Row, Tag} from "antd";
import TextArea from "antd/es/input/TextArea";

import {sysRole as role} from "@/server";
import CRUDPage from "@/components/CRUDPage/CRUDPage";

class Role extends Component {


    layoutQueryForm = (form) => {
        const {getFieldDecorator} = form
        return (
            <>
                <Col span={6}>
                    <Form.Item label={`角色名称`}>
                        {getFieldDecorator(`role`, {
                            rules: [
                                {required: false, message: '请输入角色名称!',},
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
    layoutSaveForm = (form, component) => {
        const {getFieldDecorator} = form

        return (
            <>
                <Row>
                    <Col span={11}>
                        <Form.Item label="名称">
                            {getFieldDecorator('role', {
                                rules: [{required: true, message: '请输入用户名!'}],
                            })(<Input/>)}
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
                    {/*角色首页&权重*/}
                    <Form.Item label="首页路径">
                        {getFieldDecorator('home', {
                            initialValue: '/admin/home',
                            rules: [{required: false, message: '请配置首页路径!'}],
                        })(<Input/>)}
                    </Form.Item>
                    <Form.Item label="优先级">
                        {getFieldDecorator('weight', {
                            initialValue: 1,
                        }, {
                            rules: [{required: false, message: '请配置首页权重!'}],
                        })(<Input placeholder={"拥有多个角色时匹配首页的优先级(数字越大优先级越高)"} type={"number"}/>)}
                    </Form.Item>
                </Row>

                <Row>
                    <Col>
                        <Form.Item label="描述">
                            {getFieldDecorator('description', {
                                rules: [{required: false, message: '请输入角色描述!'}],
                            })(<TextArea style={{width: "100%"}} rows={3}/>)}
                        </Form.Item>
                    </Col>
                </Row>

            </>)
    }

    layoutEditRowForm = (context, cellProps) => {

        const {
            dataIndex, //字段名即控件的`name`属性
            title, record
        } = cellProps;

        const elementRules = () => {
            let cellRules = [{required: false, message: `请输入 ${title}!`,},]
            if (dataIndex === 'role') {
                cellRules = [{required: true, message: `请输入 ${title}!`,},]
            } else if (dataIndex === 'locked') {
                cellRules = [{required: true, message: `请输入 ${title}!`,}]
            }
            return cellRules
        }

        const elementInitValue = () => {
            if (dataIndex === 'createTime') {
                let currentVal = record[dataIndex];
                if (!currentVal) {
                    return moment(new Date())
                }
                return moment(currentVal)
            }

            return record[dataIndex]
        }

        const elementType = () => {
            let component = <Input/>
            //根据字段类型设置控件类型
            if (dataIndex === 'createTime') {
                component = <DatePicker format={"YYYY-MM-DD HH:mm:ss"}/>;
            }


            if (dataIndex === 'description') {
                component = <TextArea/>;
            }

            if (dataIndex === 'locked') {
                component =
                    <Radio.Group>
                        <Radio value={false}>正常</Radio>
                        <Radio value={true}>锁定</Radio>
                    </Radio.Group>;
            }

            if (dataIndex === 'weight') {
                component =
                    <Input placeholder={"拥有多个角色时匹配首页的优先级(数字越大优先级越高)"} type={"number"}/>
            }
            return component;
        }

        return {elementRules, elementInitValue, elementType, style: {margin: 0,}}
    }

    tableColumnsConfig = (columns) => {
        //添加列
        columns.push({title: '角色名称', dataIndex: 'role', editable: true,});
        columns.push({title: '角色描述', dataIndex: 'description', editable: true,});
        columns.push({title: '角色首页', dataIndex: 'home', editable: true,});
        columns.push({title: '优先级', dataIndex: 'weight', editable: true,});
        columns.push({
            title: '状态', dataIndex: 'locked', editable: true,
            width: '10%',
            render: item => (<Tag color={item ? 'geekblue' : 'green'}>{item ? '锁定' : '正常'}</Tag>),
        });
        columns.push({
            title: '创建时间', dataIndex: 'createTime', editable: true,
            render: item => (item ? (typeof item === 'string' ? item : item.format("YYYY-MM-DD HH-MM-SS")) : ""),
        });
        columns.push({title: '更新时间', dataIndex: 'updateTime', editable: false,
            render: item => (item ? (typeof item === 'string' ? item : item.format("YYYY-MM-DD HH-MM-SS")) : ""),
        });
        // return columns
    }

    proSaveSysRole = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            // createTime: fieldsValue['createTime'].format('YYYY-MM-DD  HH:mm:ss')
        }
        return role.saveSysRole(values)
    }

    proUpdateSysRole = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            createTime: fieldsValue['createTime'].format('YYYY-MM-DD  HH:mm:ss')
        }
        return role.updateSysRole(values)
    }


    render() {
        return (
            <div>
                <CRUDPage
                    apiSave={this.proSaveSysRole}
                    apiUpdate={this.proUpdateSysRole}
                    apiDelete={role.deleteSysRole}
                    apiQuery={role.getSysRoleList}
                    primaryKey='id'
                    layoutQueryForm={this.layoutQueryForm}
                    layoutSaveForm={this.layoutSaveForm}
                    layoutEditRowForm={this.layoutEditRowForm}
                    tableColumnsConfig={this.tableColumnsConfig}
                    saveFormConfig={{title: "角色信息", okText: "确认", cancelText: "取消"}}
                />
            </div>
        );
    }
}

export default Role;
