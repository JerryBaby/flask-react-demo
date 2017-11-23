import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Layout, Avatar } from 'antd';


const { Header } = Layout;


class HeaderContent extends Component {
    render() {
        return (
            <Header style={{ background: '#fff', padding: 10 }}>
              <Avatar src="static/jerry.jpg" style={{ float: 'right', margin: '10px' }} />
            </Header>
        );
    }
}

export default HeaderContent;
