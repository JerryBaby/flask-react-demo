import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layout, Icon, Avatar} from 'antd';
import SidebarMenu from './menu';


const { Sider } = Layout;


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }

    onCollapse(collapsed) {
        this.setState({collapsed});
    }

    render() {
        return (
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse.bind(this)}>
              <div className="logo">
                <img src="static/jerry.jpg" height="100%" width="100%" />
              </div>
              <SidebarMenu cKey={this.props.cKey} />
            </Sider>
        );
    }
}

export default SideBar;
