import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Table, Icon, Popconfirm } from 'antd';


//编辑和删除操作在这个文件里增加
//编辑操作显示modal
//删除操作是Popconfirm


class ServerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tData: [],
            roleData: [],
            platData: [],
            regionData: [],
            attrData: [],
            statusData: [],
        };
    }

    componentDidMount() {
        this.fetchTableData();
        this.fetchServerRole();
        this.fetchPlatform();
        this.fetchAttribute();
        this.fetchStatus();
        // 获取角色 云平台 区域 属性 状态
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
                tData: data.result,
            });
        }).catch((e) => {console.log('Fetch failed: ',e);});
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
                filters: [{
                    text: '阿里云',
                    value: '阿里云',
                }, {
                    text: '腾讯云',
                    value: '腾讯云',
                }],
                onFilter: (value, record) => { return record.platform === value },
                sorter: (a, b) => { return a.platform.localeCompare(b.platform) },
            },
            {
                title: '区域',
                dataIndex: 'region',
            },
            {
                title: '属性',
                dataIndex: 'attribute',
                sorter: (a, b) => { return a.attribute.localeCompare(b.attribute) },
            },
            {
                title: '状态',
                dataIndex: 'status',
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
            <Table columns={columns} dataSource={this.state.tData} />
        );
    }
}

export default ServerTable;