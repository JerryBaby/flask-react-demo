import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Avatar, Dropdown, Layout, Menu } from 'antd';


const { Header } = Layout;
const menu = (
    <Menu>
      <Menu.Item>
        <a href="/auth/logout">退出</a>
      </Menu.Item>
    </Menu>
);


class HeaderContent extends Component {
    render() {
        return (
            <Header style={{ background: '#fff', padding: 10 }}>
              <Dropdown overlay={menu}>
                <Avatar size="large" src="static/jerry.jpg" style={{ float: 'right', margin: '5px' }} />
              </Dropdown>
            </Header>
        );
    }
}

export default HeaderContent;
