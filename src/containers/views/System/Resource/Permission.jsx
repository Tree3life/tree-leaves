import React, {Component} from 'react';
import {sysPerm as perm} from "@/server";
import {Col, DatePicker, Form, Input, Radio, Row, Tag} from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import CRUDPage from "@/components/CRUDPage/CRUDPage";

class Permission extends Component {
    layoutQueryForm = (form) => {
        const {getFieldDecorator} = form
        return (
            <>
                <Col span={6}>
                    <Form.Item label={`权限名称`}>
                        {getFieldDecorator(`role`, {
                            rules: [
                                {required: false, message: '请输入权限名称!',},
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
                        <Form.Item label="权限名称">
                            {getFieldDecorator('permission', {
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
            if (dataIndex === 'permission') {
                cellRules = [{required: true, message: `请输入 ${title}!`,},]
            } else if (dataIndex === 'description') {
                cellRules = [{required: true, message: `请输入 ${title}!`,}]
            }
            return cellRules
        }

        const elementInitValue = () => {
            if (dataIndex === 'createTime') {
                return moment(record[dataIndex])
            }

            return record[dataIndex]
        }

        const elementType = () => {
            let component = <Input/>
            //根据字段类型设置控件类型
            if (dataIndex === 'createTime') {
                component = <DatePicker disabled={true} format={"YYYY-MM-DD HH:mm:ss"}/>;
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
            return component;
        }

        return {elementRules, elementInitValue, elementType, style: {margin: 0,}}

    }

    tableColumnsConfig = (columns) => {
        //添加列
        columns.push({title: '权限名称', dataIndex: 'permission', editable: true,});
        columns.push({title: '权限描述', dataIndex: 'description', editable: true,});
        columns.push({
            title: '状态', dataIndex: 'locked', editable: true,
            width: '10%',
            render: item => (<Tag color={item ? 'geekblue' : 'green'}>{item ? '锁定' : '正常'}</Tag>),
        });
        columns.push({
            title: '创建时间', dataIndex: 'createTime', editable: true,
            render: item => (typeof item === 'string' ? item : (item === null || item === undefined ? null : item.format("YYYY-MM-DD HH-MM-SS"))),
        });
        columns.push({title: '更新时间', dataIndex: 'updateTime', editable: false,});

    }
    proUpdateSysPerm = (formValues) => {
        let params={
            ...formValues,
            createTime: formValues['createTime'].format('YYYY-MM-DD HH:mm:ss')
        }
        return perm.updateSysPerm(params)
    }

    render() {
        return (
            <div>
                <CRUDPage
                    apiSave={perm.saveSysPerm}
                    apiUpdate={this.proUpdateSysPerm}
                    apiDelete={perm.deleteSysPerm}
                    apiQuery={perm.getSysPermList}
                    primaryKey='id'
                    layoutQueryForm={this.layoutQueryForm}
                    layoutSaveForm={this.layoutSaveForm}
                    layoutEditRowForm={this.layoutEditRowForm}
                    tableColumnsConfig={this.tableColumnsConfig}
                    saveFormConfig={{title: "权限信息", okText: "确认", cancelText: "取消"}}
                />

            </div>
        );
    }
}

export default Permission;
