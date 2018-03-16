import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderContent from './framework/header';
import FooterContent from './framework/footer';
import SideBar from './framework/sider';
import Navigation from './dashboard/navigation/navigation';
import Alerts from './dashboard/alerts/alerts';
import Servers from './servers/servers';
import CMDB from './cmdb/clock/cmdb';
import SwitchLine from './cmdb/switchline/switchline'


class Main extends Component {
    render() {
        return (
            <Layout className="layout">
              <SideBar />
              <Layout>
                <HeaderContent />

                <Switch>
                  <Route path="/dashboard/navigation" component={Navigation} />
                  <Route path="/dashboard/alerts" component={Alerts} />
                  <Route path="/servers" component={Servers} />
                  <Route path="/cmdb/switchline" component={SwitchLine} />
                  <Route path="/cmdb/demo" component={CMDB} />
                </Switch>

                <FooterContent />
              </Layout>
            </Layout>
        );
    }
}


export default Main;
