import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';


const { Footer } = Layout;


class FooterContent extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
              Jerry @2017 Created by Ant UED
            </Footer>
        );
    }
}

export default FooterContent;
