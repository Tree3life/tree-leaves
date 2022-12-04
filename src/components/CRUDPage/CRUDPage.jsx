import {Button, Col, Form, message, Modal, Popconfirm, Row, Table} from "antd";
import PropTypes from 'prop-types'; // 引入依赖
import React from "react";

/**效果：通过属性配置，直接生成对一个实体模型的增删改查
 * 对Context的理解
 * 一个Context最上层的组件 是最小的复用单元；
 * Context内部的组件不能在Context外部复用；
 *使用说明：
 <CRUDPageAttr
 style={{backgroundColor: '#f7f7f7'}}//暂未开放
 className={'aaaa'}//暂未开放
 apiSave={this.proSaveSysRole}//保存接口（调用接口前对控件收集到的参数进行预处理）
 apiUpdate={this.proUpdateSysRole}//编辑接口（调用接口前对控件收集到的参数进行预处理）
 apiDelete={role.deleteSysRole}//直接调用接口
 apiQuery={role.getSysRoleList}//直接调用接口
 primaryKey='id'
 layoutQueryForm={this.layoutQueryForm}//条件查询表单的布局
 layoutSaveForm={this.layoutSaveForm}//新增表单的布局
 layoutEditRowForm={this.layoutEditRowForm}//行编辑表单的布局及配置
 tableColumnsConfig={this.tableColumnsConfig}//主体表格的配置
 saveFormConfig={{title: "角色信息", okText: "确认", cancelText: "取消"}}//新增表单外侧弹框的设置
 />
 */

//region主组件内用于的消息总线
const CRUDContext = React.createContext();
//endregion主组件内用于的消息总线

//region 主组件
@Form.create()
class CRUDPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            editingKey: '',
            createFormVisible: false,
        };
        const {tableColumnsConfig} = this.props

        this.columns = [];
        //用于加载 上层组件自定义配置的列
        tableColumnsConfig(this.columns)

        const {primaryKey} = this.props

        //配置操作列
        this.columns.push({
            title: '操作',
            render: (text, record) => {
                const {editingKey} = this.state;
                const editable = record.key === this.state.editingKey;

                return editable ?
                    (<span>
                            <CRUDContext.Consumer>{({form}) => (
                                <span onClick={() => this.update(form, record.key)}
                                      style={{marginRight: 8, color: 'skyblue'}}>
                                    保存
                                </span>
                            )}
                            </CRUDContext.Consumer>
                            <Popconfirm title="不保存?" okText={'是'} cancelText={'否'}
                                        onConfirm={() => this.cancel(record.key)}>
                              <span style={{color: 'skyblue'}}>取消</span>
                            </Popconfirm>
                    </span>) :
                    (<>
                            <span style={{color: 'skyblue'}} disabled={editingKey !== ''}
                                  onClick={() => this.edit(record[primaryKey])}>
                            编辑
                            </span>
                            &nbsp;&nbsp;
                            <Popconfirm title="真的要删除吗?" okText={'是'} cancelText={'否'}
                                        onConfirm={() => this.delete(record[primaryKey], record)}>
                                <span style={{color: 'skyblue'}}>删除</span>
                            </Popconfirm>
                        </>
                    );
            },
        },)
    }

    // react 会解析 porpTypes 静态属性，首字母是小写p
    static propTypes = {
        primaryKey: PropTypes.string,  // 这里的 PropTypes 指 prop-types依赖，类型是小写
    }
    // react 会解析 defaultProps 静态属性，props默认值
    static defaultProps = {
        primaryKey: 'id'
    }

    componentDidMount() {
        this.initUsers()
    }

    cancel = () => {
        this.setState({editingKey: ''});
    };

    initUsers = async () => {
        const {apiQuery, primaryKey} = this.props
        try {
            let resp = await apiQuery()
            let mapData = resp.data.map(ele => {
                return {key: ele[primaryKey], ...ele}
            })
            this.setState({"data": mapData});
        } catch (error) {
            message.warn(error.toString(), 3)
        }
    }

    add = () => {
        const {apiSave, primaryKey} = this.props
        const {form} = this.formRef.props;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            try {
                let resp = await apiSave(values)
                this.state.data.unshift({key: resp.data[primaryKey], ...resp.data})
                message.success('添加成功', 1)
                form.resetFields();
                this.setState({createFormVisible: false});
            } catch (error) {
                message.warn('添加失败：' + error, 3)
            }
        });
    }

    //删除
    delete = async (id) => {
        const {apiDelete, primaryKey} = this.props

        try {
             await apiDelete({[primaryKey]: id})
            this.setState({'data': this.state.data.filter(ele => ele[primaryKey] !== id)})
            message.success("删除成功", 1)
        } catch (error) {
            message.warn("删除失败：" + error, 3)
        }

    }

    update = (form, key) => {
        const {apiUpdate} = this.props

        form.validateFields(async (error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                let paramObj = {...item, ...row}//构造要保存的最新对象

                try {
                    await apiUpdate(paramObj)
                    newData.splice(index, 1, paramObj);
                    this.setState({data: newData, editingKey: ''});
                    message.success("编辑成功", 1)
                }catch (error){
                    message.warn("编辑失败"+error, 3)
                }

            } else {
                newData.push(row);
                this.setState({data: newData, editingKey: ''});
            }
        });
    }

    edit = (key) => {
        this.setState({editingKey: key});
    }

    updateTableData = (data) => {
        this.setState({data: data})
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        //todo 再次优化表格的列
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    // inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: record.key === this.state.editingKey,
                }),
            };
        });

        return (
            <CRUDContext.Provider value={{...this.props}}>
                {/*条件查询*/}
                <QueryForm updateTableData={this.updateTableData}/>
                <Table
                    components={components}
                    bordered
                    title={() => {
                        return <div>
                            <Button type="primary" onClick={() => {
                                this.setState({createFormVisible: true});
                            }}>
                                添加
                            </Button>
                            <CRUDForm
                                wrappedComponentRef={formRef => {
                                    this.formRef = formRef;
                                }}
                                visible={this.state.createFormVisible}
                                onCancel={() => {
                                    this.setState({createFormVisible: false});
                                }}
                                onCreate={this.add}
                            />
                        </div>
                    }}
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                />
            </CRUDContext.Provider>
        );
    }

}

//endregion 主组件

//region 注册用户的弹框
const CRUDForm = Form.create({name: 'crud_form_in_modal'})(
    class extends React.Component {
        static contextType = CRUDContext
        state = {
            confirmDirty: false,
        };

        render() {
            const {layoutSaveForm, saveFormConfig} = this.context
            const {visible, onCancel, onCreate, form} = this.props;
            return (
                <Modal {...saveFormConfig} visible={visible} onCancel={onCancel} onOk={onCreate}>
                    <Form layout="vertical">
                        {layoutSaveForm ? layoutSaveForm(form, this) : ''}
                    </Form>
                </Modal>
            );
        }
    },
);
//endregion 注册用户的弹框

//region 查询表单
@Form.create()
class QueryForm extends React.Component {
    static contextType = CRUDContext;//等价于QueryForm.contextType = CRUDContext;

    handleSearch = e => {
        const {apiQuery, primaryKey} = this.context
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            try {
                let resp = await apiQuery(values);
                this.props.updateTableData(resp.data.map(ele => {
                    return {key: ele[primaryKey], ...ele}
                }))
            }catch (error){
                message.warn(error, 3)
            }
        });
    };

    render() {
        const {layoutQueryForm} = this.context
        return <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={24}>
                {layoutQueryForm ? layoutQueryForm(this.props.form) : ''}
                <Col span={5} style={{textAlign: 'left', paddingTop: '43px'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{marginLeft: 8}} onClick={() => {
                        this.props.form.resetFields()
                    }}>重置</Button>
                </Col> </Row>
        </Form>
    }
}

//endregion 查询表单

//region可编辑表格Cell
class EditableCell extends React.Component {
    renderCell = (context) => {
        const {form: {getFieldDecorator}} = context
        const {
            editing, //是否处于编辑状态
            dataIndex, //字段名即控件的`name`属性
            title, record, index, children, ...restProps
        } = this.props;
        const {layoutEditRowForm} = context
        let style = {}//设置默认值
        const {elementRules, elementInitValue, elementType} = layoutEditRowForm(context, this.props)

        //使用外部样式的配置
        if (layoutEditRowForm.style) {
            style = layoutEditRowForm.style
        }

        //可编辑行表单
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{...style}}>
                        {getFieldDecorator(dataIndex, {
                            rules: elementRules(),
                            //可编辑行初始化值
                            initialValue: elementInitValue(),
                        })(
                            //可编辑行组件类型
                            elementType()
                        )}
                    </Form.Item>
                ) : (children)}
            </td>
        );
    };

    render() {
        return <CRUDContext.Consumer>{this.renderCell}</CRUDContext.Consumer>;
    }
}

//endregion可编辑表格Cell

export default CRUDPage;
