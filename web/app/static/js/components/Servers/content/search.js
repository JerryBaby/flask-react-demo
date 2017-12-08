import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Select, Button } from 'antd';
import ServerAddModal from './serveradd';

const Option = Select.Option;


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hostValue: '',
            ipValue: '',
        };
    }

    handleHostSelect(value) {
        if (value) {
            this.setState({
                hostValue: value,
            });
        } else {
            this.setState({
                hostValue: '',
            });
            this.props.handleClear();
        }
    }

    handleIPSelect(value) {
        if (value) {
            this.setState({
                ipValue: value,
            });
        } else {
            this.setState({
                ipValue: '',
            });
            this.props.handleClear();
        }
    }

    handleSearch() {
        let data = {
            'hostname': this.state.hostValue,
            'ip': this.state.ipValue,
        };
        this.props.searchTable(data);
    }

    render() {
        const datas = this.props.datas;
        let isDisabled = (this.state.hostValue || this.state.ipValue) ? false : true;
        let hostOptions = datas.map((t) => <Option key={t.hostname}>{t.hostname}</Option>);
        let ipOptions = [];
        for (let ips of datas) {
            for (let ip of ips.ip) {
                ipOptions.push(<Option key={ip}>{ip}</Option>);
            }
        }

        return (
            <div style={{ margin: '10px' }}>
              <Row type="flex" align="middle">
                <Col span={6}>
                  <Select showSearch allowClear placeholder="服务器" style={{ width: 250, padding: '5px' }} onChange={this.handleHostSelect.bind(this)}>
                    {hostOptions}
                  </Select>
                </Col>
                <Col span={4}>
                  <Select showSearch allowClear placeholder="IP地址" style={{ width: 150, padding: '5px' }} onChange={this.handleIPSelect.bind(this)}>
                    {ipOptions}
                  </Select>
                </Col>
                <Col span={6}>
                  <Button type="primary" disabled={isDisabled} onClick={this.handleSearch.bind(this)}>Search</Button>
                </Col>
                <Col span={6}>
                  <ServerAddModal
                    cascadeData={this.props.cascadeData}
                    roleData={this.props.roleData}
                    handleAddServer={this.props.handleAddServer}
                  />
                </Col>
              </Row>
            </div>
        );
    }
}

export default Search;
