import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Avatar, Icon, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';


const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selected: 'dashboard',
        }
    }

    onCollapse(collapsed) {
        this.setState({collapsed});
    }

    handleClick(e) {
        this.setState({
            selected: e.key,
        });
    }

    render() {
        return (
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse.bind(this)}>

              <div className="logo" />

              <Menu
                theme="dark"
                mode="inline"
                onClick={this.handleClick.bind(this)}
                selectedKeys={[this.state.selected]}>
                <Menu.Item key="dashboard">
                  <Link to="/"><Icon type="pie-chart" /><span>Dashboard</span></Link>
                </Menu.Item>
                <Menu.Item key="servers">
                  <Link to="/servers"><Icon type="desktop" /><span>Servers</span></Link>
                </Menu.Item>
                <Menu.Item key="cmdb">
                  <Link to="/cmdb"><Icon type="file-text" /><span>CMDB</span></Link>
                </Menu.Item>
              </Menu>
            </Sider>
        );
    }
}

export default SideBar;
