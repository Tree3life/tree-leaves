import React, {Component, lazy, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import {connect} from "react-redux";

import {Col, Layout, Row} from "antd";
import './index.css'

import Loading from '@/components/TreeUi/Loading/Loading01/'
import AppMenu from "@/containers/Dashboard/AppMenu/AppMenu";
import Home from "@/containers/views/Home/home.jsx";

import Crumbs from "./Crumbs/Crumbs";
import Role from "@/containers/views/System/Role/Role";
import Resource from "@/containers/views/System/Resource/Resource";


@connect(state => ({cache: state.cache}))
class Dashboard extends Component {

    //todo 动态生成路由
    // createRoute = () => {
    //     const {pages} = this.props.cache;
    //
    //     let aa = pages.map(pageInfo => {
    //         return <Route key={pageInfo.path} path={pageInfo.path}
    //                       component={lazy(() => import(pageInfo.filePath))}/>
    //     })
    //     console.log("===============================")
    //     console.log(aa)
    //     console.log("===============================>>>>>><>")
    //     return aa
    // }

    render() {
        const {Header, Sider, Content} = Layout;
        return (
            <Layout className="layout">
                <Header className="header">
                    <Row>
                        <Col span={22}>
                            <Loading/>
                        </Col>
                        <Col span={2}>
                            <Crumbs/>
                        </Col>
                    </Row>
                </Header>
                <Layout className='layout'>
                    <Sider width="15.263%" className="sider">
                        <AppMenu/>
                    </Sider>
                    <Content className="content">
                        <div className="main">
                            {/*todo 根据sys_page表动态生成路由，sys_page表中添加component相关的字段：componentPath,componentName*/}
                            动态切换
                            <Suspense fallback={<h1>拼命加载中...</h1>}>
                                <Switch>
                                    {/*{this.createRoute()}*/}
                                    <Route path="/admin/home" component={Home}/>
                                    <Route path="/admin/sys/resource" component={Resource}/>
                                    <Route path="/admin/sys/role" component={Role}/>
                                    <Route path="/admin/sys/user"
                                           component={lazy(() => import('@/containers/views/System/User/User'))}/>

                                    <Redirect to="/admin/home"/>
                                </Switch>
                            </Suspense>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default Dashboard;
