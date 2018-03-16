import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Avatar, Icon, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';


const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.rootSubmenuKeys = ['dashboard', 'cmdb'];
        this.state = {
            collapsed: false,
            selected: 'servers',
            openKeys: [],
        }
    }

    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    handleClick(e) {
        this.setState({
            selected: e.key,
        });
    }

    onCollapse(collapsed) {
        this.setState({collapsed});
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
                onOpenChange={this.onOpenChange.bind(this)}
                openKeys={this.state.openKeys}
                selectedKeys={[this.state.selected]}>
                <SubMenu key="dashboard" title={<div><Icon type="pie-chart" /><span>仪表盘</span></div>}>
                  <Menu.Item key="navigation">
                    <Link to="/dashboard/navigation">导航页面</Link>
                  </Menu.Item>
                  <Menu.Item key="alerts">
                    <Link to="/dashboard/alerts">告警信息</Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="servers">
                  <Link to="/servers"><Icon type="desktop" /><span>服务器</span></Link>
                </Menu.Item>
                <SubMenu key="cmdb" title={<div><Icon type="file-text" /><span>配置管理</span></div>}>
                  <Menu.Item key="switch">
                    <Link to="/cmdb/switchline">切课页面</Link>
                  </Menu.Item>
                  <Menu.Item key="demo">
                    <Link to="/cmdb/demo">demo</Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
        );
    }
}

export default SideBar;
