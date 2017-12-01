import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Popconfirm } from 'antd';
import Search from './header';


//编辑和删除操作在这个文件里增加
//编辑操作显示modal
//删除操作是Popconfirm


class ServerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tData: [],
            hostData: [],
            ipData: [],
            roleData: [],
            platData: [],
            regionData: [],
        };
    }

    componentDidMount() {
        this.fetchTableData();
        // 获取角色 云平台 区域
        this.fetchServerRole();
        this.fetchPlatform();
    }

    fetchTableData() {
        fetch('/server_api/get_servers', {
            method: 'GET',
            credentials: 'include',
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                console.log('Bad request: ', res.url, 'statue: ', res.status);
            }
        }).then((data) => {
            let hostData = [];
            let ipData = [];
            for (let x of data.result) {
                hostData.push({"hostname": x.hostname});
                for (let i of x.ip) {
                    ipData.push({"ip": i.replace(/\s\(\S*\)/, "")});
                }
            }
            this.setState({
                tData: data.result,
                hostData: hostData,
                ipData: ipData,
            });
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    fetchServerRole() {
        fetch('/server_api/get_roles', {
            method: 'GET',
            credentials: 'include',
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                console.log('Bad request: ', res.url, 'statue: ', res.status);
            }
        }).then((data) => {
            let roleData = [];
            for (let x of data.result) {
                roleData.push({text: x.role, value: x.role});
            }
            this.setState({
                roleData: roleData,
            });
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    fetchPlatform() {
        fetch('/server_api/get_platforms', {
            method: 'GET',
            credentials: 'include',
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                console.log('Bad request: ', res.url, 'statue: ', res.status);
            }
        }).then((data) => {
            let platData = [];
            let regionData = [];
            let regions = [];
            for (let x of data.result) {
                platData.push({text: x.platform, value: x.platform});
                let region = x.region;
                for (let x of region) {
                    if (regions.indexOf(x) === -1) {
                        regions.push(x);
                    }
                }
            }
            for (let x of regions) {
                regionData.push({text: x, value: x});
            }
            this.setState({
                platData: platData,
                regionData: regionData,
            });
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    searchTable(data) {
        if (data.code === 0) {
            this.setState({
                tData: data.result,
            });
        } else {
            this.setState({
                tData: [],
            });
        }
    }

    render() {
        const columns = [
            {
                title: '服务器',
                dataIndex: 'hostname',
                sorter: (a, b) => { return a.hostname.localeCompare(b.hostname) },
            },
            {
                title: '角色',
                dataIndex: 'role',
                filters: this.state.roleData,
                onFilter: (value, record) => { return record.role === value },
                sorter: (a, b) => { return a.role.localeCompare(b.role) },
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                render: (text, record, index) => {
                    if (text.length > 0) {
                        let res = [];
                        text.forEach((value) => {
                            res.push(<div key={value}>{value}</div>);
                        })
                        return res;
                    } else {
                        return (<div>-</div>);
                    }
                },
            },
            {
                title: '云平台',
                dataIndex: 'platform',
                filters: this.state.platData,
                onFilter: (value, record) => { return record.platform === value },
                sorter: (a, b) => { return a.platform.localeCompare(b.platform) },
            },
            {
                title: '区域',
                dataIndex: 'region',
                filters: this.state.regionData,
                onFilter: (value, record) => { return record.region === value },
            },
            {
                title: '属性',
                dataIndex: 'attribute',
                filters: [{
                    text: 'Virtual',
                    value: 'Virtual',
                }, {
                    text: 'Physical',
                    value: 'Physical',
                }],
                onFilter: (value, record) => { return record.attribute === value },
                sorter: (a, b) => { return a.attribute.localeCompare(b.attribute) },
            },
            {
                title: '状态',
                dataIndex: 'status',
                filters: [{
                    text: '在线',
                    value: '在线',
                }, {
                    text: '下线',
                    value: '下线',
                }],
                onFilter: (value, record) => { return record.status === value },
                sorter: (a, b) => { return a.status.localeCompare(b.status) },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                    <span>
                        <Icon type="edit" onClick={() => console.log(record.key)} />&nbsp;&nbsp;
                        <Popconfirm title="Sure to delete?"><Icon type="delete" /></Popconfirm>
                    </span>
                    );
                },
            }
        ];

        return (
            <div>
              <Search hostData={this.state.hostData} ipData={this.state.ipData} searchTable={this.searchTable.bind(this)} />
              <Table columns={columns} dataSource={this.state.tData} />
            </div>
        );
    }
}

export default ServerTable;
