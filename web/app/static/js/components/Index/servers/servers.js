import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';
import ServerTable from './component/datatable';


const { Content } = Layout;


class Servers extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <ServerTable />
            </Content>
        );
    }
}

export default Servers;
