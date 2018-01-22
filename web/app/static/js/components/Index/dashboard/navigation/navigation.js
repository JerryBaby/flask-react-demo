import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';


const { Content } = Layout;


class Navigation extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <p>Navigation</p>
            </Content>
        );
    }
}

export default Navigation;
