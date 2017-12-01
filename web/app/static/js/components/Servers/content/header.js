import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Select, Button } from 'antd';

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
        }
    }

    handleSearch() {
        let data = JSON.stringify({
            'hostname': this.state.hostValue,
            'ip': this.state.ipValue,
        });

        fetch('/server_api/search', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: data,
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                console.log('Bad request: ', res.url, 'statue: ', res.status);
            }
        }).then((data) => {
            this.props.searchTable(data);
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    render() {
        let isDisabled = (this.state.hostValue || this.state.ipValue) ? false : true;
        const hostOptions = this.props.hostData.map((d) => <Option key={d.hostname}>{d.hostname}</Option>);
        const ipOptions = this.props.ipData.map((d) => <Option key={d.ip}>{d.ip}</Option>);

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
              </Row>
            </div>
        );
    }
}

export default Search;
