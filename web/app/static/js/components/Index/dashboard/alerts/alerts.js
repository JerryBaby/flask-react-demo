import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';


const { Content } = Layout;


class Alerts extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <p>Alerts</p>
            </Content>
        );
    }
}

export default Alerts;
