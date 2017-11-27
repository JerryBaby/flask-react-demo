import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import SideBar from './sider';
import HeaderContent from './header';
import BodyContent from './content/content';
import FooterContent from './footer';


class Navigation extends Component {
    //constructor(props) {
        //super(props);
        //this.state = {
            //pathname: 'nishishadan',
        //}
    //}

    render() {
        return (
            <Layout className="layout">
              <SideBar cKey="servers" />
              <Layout>
                <HeaderContent />
                <BodyContent />
                <FooterContent />
              </Layout>
            </Layout>
        );
    }
}


ReactDOM.render(
    <Navigation />,
    document.getElementById('react-demo')
);
