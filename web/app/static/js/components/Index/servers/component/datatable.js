import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Badge, Button, Icon, message, Table } from 'antd';
import Search from './search';
import ServerEditModal from './serveredit';
import './datatable.css';


class ServerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            tData: [],
            roleData: [],       //角色筛选条件; serveraddmodal 角色下拉菜单
            platData: [],       //平台筛选条件
            regionData: [],     //区域筛选条件
            cascadeData: [],    // serveraddmodal 平台区域下拉菜单
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
            this.setState({
                datas: data.result,
                tData: data.result,
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
            let cascadeData = [];
            for (let x of data.result) {
                platData.push({text: x.platform, value: x.platform});
                cascadeData.push({'platform': x.platform, 'region': x.region});
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
                cascadeData: cascadeData,
            });
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    searchTable(data) {
        const tData = [...this.state.datas];
        const hostItem = tData.filter((item) => item.hostname === data.hostname);
        const ipItem = tData.filter((item) => item.ip.indexOf(data.ip) != -1);

        if (hostItem.length === 0) {
            this.setState({
                tData: ipItem,
            });
        } else if (ipItem.length === 0) {
            this.setState({
                tData: hostItem,
            });
        } else if (hostItem[0].key === ipItem[0].key) {
            this.setState({
                tData: hostItem,
            });
        } else {
            this.setState({
                tData: hostItem.concat(ipItem),
            });
        }
    }

    handleClear() {
        const tData = [...this.state.datas];
        this.setState({
            tData: tData,
        });
    }

    handleAddServer(data) {
        //添加服务器的回调
        //使用新数据渲染列表实现动态更新
        const tData = [...this.state.tData, data];
        const datas = [...this.state.datas, data];
        this.setState({
            tData: tData,
            datas: datas,
        });
    }

    handleEditServer(data) {
        const tData = [...this.state.tData].map((item) => {
            if (item.key === data.key) {
                return data;
            } else {
                return item;
            }
        });
        const datas = [...this.state.datas].map((item) => {
            if (item.key === data.key) {
                return data;
            } else {
                return item;
            }
        });
        this.setState({
            tData: tData,
            datas: datas,
        });
    }

    onDelete(key) {
        //fetch 调用删除接口删除记录
        //根据key更新 tData 重新渲染
        let data = JSON.stringify({'id': key});
        fetch('/server_api/server_del', {
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
            if (data.code != 0) {
                message.error(data.result);
            } else {
                const tData = [...this.state.tData];
                const datas = [...this.state.datas];
                this.setState({
                    tData: tData.filter(item => item.key != key),
                    datas: datas.filter(item => item.key != key),
                });
                message.success(data.result);
            }
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    render() {
        const columns = [
            {
                title: '服务器',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'hostname',
                sorter: (a, b) => { return a.hostname.localeCompare(b.hostname) },
            },
            {
                title: '角色',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'role',
                filters: this.state.roleData,
                onFilter: (value, record) => { return record.role === value },
                sorter: (a, b) => { return a.role.localeCompare(b.role) },
            },
            {
                title: 'IP',
                className: 'cell',
                colSpan: 1,
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
                className: 'cell',
                colSpan: 1,
                dataIndex: 'platform',
                filters: this.state.platData,
                onFilter: (value, record) => { return record.platform === value },
                sorter: (a, b) => { return a.platform.localeCompare(b.platform) },
            },
            {
                title: '区域',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'region',
                filters: this.state.regionData,
                onFilter: (value, record) => { return record.region === value },
            },
            {
                title: '属性',
                className: 'cell',
                colSpan: 1,
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
                className: 'cell',
                colSpan: 1,
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
                title: '监控状态',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'm_status',
                render: (text, record, index) => {
                    if (text) {
                        return <Badge status="processing" text="监控中" />;
                    } else {
                        return <Badge status="error" text="未监控" />;
                    }
                },
                filters: [{
                    text: '监控中',
                    value: true,
                }, {
                    text: '未监控',
                    value: false,
                }],
                onFilter: (value, record) => { return record.m_status.toString() === value.toString() },
            },
            {
                title: '操作',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <ServerEditModal
                          passItem={() => { return record;}}
                          roleData={this.state.roleData}
                          cascadeData={this.state.cascadeData}
                          handleEditServer={this.handleEditServer.bind(this)}
                          handleConfirm={() => this.onDelete(record.key)}
                        />
                    );
                },
            }
        ];

        return (
            <div>
              <Search
                datas={this.state.datas}
                roleData={this.state.roleData}
                cascadeData={this.state.cascadeData}
                searchTable={this.searchTable.bind(this)}
                handleClear={this.handleClear.bind(this)}
                handleAddServer={this.handleAddServer.bind(this)} />
              <Table columns={columns} dataSource={this.state.tData} bordered />
            </div>
        );
    }
}

export default ServerTable;
