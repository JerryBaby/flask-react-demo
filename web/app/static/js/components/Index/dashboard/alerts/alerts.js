import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';
import AlertTable from './component/datatable';


const { Content } = Layout;


class Alerts extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <AlertTable />
            </Content>
        );
    }
}

export default Alerts;
