import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';



const data =  [
        {
            "hostname": "1-edge1-huabei-dm",
            "ip": [
                "192.168.1.1(内)",
                "1.1.1.1(外)"
            ],
            "platform": "ali",
            "role": "edge",
            "status": "在线"
        },
        {
            "hostname": "1-edge2-huabei-dm",
            "ip": [],
            "platform": "ali",
            "role": "edge",
            "status": "在线"
        },
        {
            "hostname": "1-edge3-huabei-dm",
            "ip": [],
            "platform": "ten",
            "role": "edge",
            "status": "下线"
        }
]

const columns = [
    {
        title: '主机名',
        dataIndex: 'hostname',
        key: 'hostname',
    },
    {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        //render: (record) => {
            //if (record.length > 0) {
                //let res = [];
                //record.forEach((value) => {
                    //res.push(<div key={value}>{value}</div>);
                //})
                //return res;
            //} else {
                //return (<div>-</div>);
            //}
        //},
        render: (record) => {
            let res = [];
            record.forEach((value) => {
                res.push(<div key={value}>{value}</div>);
            });
            return res;
        },
    },
    {
        title: '云平台',
        dataIndex: 'platform',
        key: 'platform',
    },
    {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    }
]

class MyTable extends Component {
    render() {
        return (
            <Table columns={columns} dataSource={data} />
        );
    }
}

export default MyTable;
