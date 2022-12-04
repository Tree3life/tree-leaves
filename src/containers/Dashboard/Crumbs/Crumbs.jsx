import React, {Component} from 'react';
import {Button, message} from "antd";
// import {application} from "@/api";
import {withRouter} from 'react-router-dom'

@withRouter
class Crumbs extends Component {
    logout = async (event) => {
       try {
           // await application.logout();
           sessionStorage.clear()
           this.props.history.push("/");
           message.success('成功退出')
       }catch (e){
            message.warn(e,3)
       }
    }

    render() {
        return (
            <div>
                <Button type={"link"} onClick={this.logout}>退出</Button>
            </div>
        );
    }
}

export default Crumbs;
