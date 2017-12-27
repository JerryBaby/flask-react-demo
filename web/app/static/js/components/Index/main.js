import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderContent from './framework/header';
import FooterContent from './framework/footer';
import SideBar from './framework/sider';
import Dashboard from './dashboard/dashboard';
import Servers from './servers/servers';
import CMDB from './cmdb/cmdb';


class Navigation extends Component {
    render() {
        return (
            <Layout className="layout">
              <SideBar />
              <Layout>
                <HeaderContent />

                <Switch>
                  <Route exact path="/" component={Dashboard} />
                  <Route path="/servers" component={Servers} />
                  <Route path="/cmdb" component={CMDB} />
                </Switch>

                <FooterContent />
              </Layout>
            </Layout>
        );
    }
}


export default Navigation;
