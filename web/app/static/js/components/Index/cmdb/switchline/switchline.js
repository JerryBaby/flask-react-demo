import React, {Component} from 'react';
import ReactDom from 'react-dom';
import { Layout } from 'antd';
import WrapperSwitchBox from './component/switchbox'

const { Content } = Layout;


class SwitchLine extends Component {
    render() {
        return (
            <Content style={{ margin: '10px', padding: '12px', background: '#fff', minHeight: '70vh' }}>
              <WrapperSwitchBox />
            </Content>
        );
    }
}

export default SwitchLine;
