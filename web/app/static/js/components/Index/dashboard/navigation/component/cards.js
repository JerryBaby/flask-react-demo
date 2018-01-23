import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Row } from 'antd';


class NavigationCards extends Component {
    handleClick(url, e) {
        const w = window.open('about:blank');
        w.location.href=url;
    }

    render() {
        const zabbix = '#';
        const grafana = '#';
        const jenkins = '#';
        const gslb = '#';
        const biTencent = '#';
        const biAli = '#';
        const duobei = '#';
        const tencent = '#';
        const ali = '#';

        return (
            <div>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#f04134', height: 120 }} onClick={this.handleClick.bind(this, zabbix)}>
                    <div>
                      <h1>ZABBIX</h1>
                      <p>监控系统</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#ffbf00', height: 120 }} onClick={this.handleClick.bind(this, grafana)}>
                    <div>
                      <h1>Grafana</h1>
                      <p>监控图表</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#bfbfbf', height: 120 }} onClick={this.handleClick.bind(this, jenkins)}>
                    <div>
                      <h1>Jenkins</h1>
                      <p>自动化平台</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#f5317f', height: 120 }} onClick={this.handleClick.bind(this, gslb)}>
                    <div>
                      <h1>GSLB</h1>
                      <p>调度系统</p>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#3dbd7d', height: 120 }} onClick={this.handleClick.bind(this, biTencent)}>
                    <div>
                      <h1>BI Tencent</h1>
                      <p>腾讯 BI 平台</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#3db8c1', height: 120 }} onClick={this.handleClick.bind(this, biAli)}>
                    <div>
                      <h1>BI Ali</h1>
                      <p>阿里 BI 平台</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#7265e6', height: 120 }} onClick={this.handleClick.bind(this, duobei)}>
                    <div>
                      <h1>DuoBei</h1>
                      <p>多贝云</p>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#108ee9', height: 120 }} onClick={this.handleClick.bind(this, tencent)}>
                    <div>
                      <h1>Tencent</h1>
                      <p>腾讯云</p>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ height: 120 }} bodyStyle={{ backgroundColor: '#f56a00', height: 120 }} onClick={this.handleClick.bind(this, ali)}>
                    <div>
                      <h1>Aliyun</h1>
                      <p>阿里云</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
        );
    }
}


export default NavigationCards;
