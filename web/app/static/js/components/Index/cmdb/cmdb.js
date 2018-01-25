import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';
import Clock from './clock';


const { Content } = Layout;


class CMDB extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <Clock />
            </Content>
        );
    }
}

export default CMDB;
