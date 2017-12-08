import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Icon, Menu } from 'antd';


const SubMenu = Menu.SubMenu;


class SidebarMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.cKey,
        }
    }

    onMenuItemClick(response) {
        let key = response.key;

        switch(key) {
            case 'index':
                location.href = '/';
                break;
            case 'servers':
                location.href = 'servers';
                break;
            case 'users':
                location.href = 'users';
                break;
            case 'cmdb':
                location.href = 'cmdb';
                break;
            default:
                console.log('Unknown menu item ', key);
        }
    }

    render() {
        return (
            <Menu theme="dark" selectedKeys={[this.state.selected]} mode="inline" onClick={this.onMenuItemClick.bind(this)}>
              <Menu.Item key="index">
                <Icon type="pie-chart" />
                <span>Dashboard</span>
              </Menu.Item>
              <Menu.Item key="servers">
                <Icon type="desktop" />
                <span>Servers</span>
              </Menu.Item>
              <Menu.Item key="users">
                <Icon type="user" />
                <span>Users</span>
              </Menu.Item>
              <Menu.Item key="cmdb">
                <Icon type="file-text" />
                <span>CMDB</span>
              </Menu.Item>
            </Menu>
        );
    }
}

export default SidebarMenu;
