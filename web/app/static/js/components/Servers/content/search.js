import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Col, Row, Select } from 'antd';
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
            <div style={{ marginBottom: '10px', backgroundColor: '#f5f5f5' }}>
              <Row type="flex" align="middle">
                <Col span={6}>
                  <Select
                    style={{ width: '98%', margin: '10px' }}
                    showSearch
                    allowClear
                    placeholder="服务器"
                    onChange={this.handleHostSelect.bind(this)}>
                      {hostOptions}
                  </Select>
                </Col>
                <Col span={6}>
                  <Select
                    style={{ width: '98%', margin: '10px' }}
                    showSearch
                    allowClear
                    placeholder="IP地址"
                    onChange={this.handleIPSelect.bind(this)}>
                      {ipOptions}
                  </Select>
                </Col>
                <Col span={6}>
                  <Button
                    style={{ margin: '10px' }}
                    type="primary"
                    icon="search"
                    disabled={isDisabled}
                    onClick={this.handleSearch.bind(this)}>
                  </Button>
                </Col>
                <Col span={6} style={{ padding: '10px', textAlign: 'right' }}>
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
