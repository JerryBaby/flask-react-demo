import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import './datatable.css';



class AlertTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tData: [],
        };
    }

    componentWillMount() {
        this.fetchAlertData();
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.fetchAlertData();
        }, 60000);
    }

    componentWillUnMount() {
        clearInterval(this.timer);
    }

    fetchAlertData() {
        fetch('/dashboard_api/get_alerts', {
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
        }).catch((e) => {
            console.log('Fetch failed: ', e);
        });
    }

    render() {
        const columns = [
            {
                title: '主机',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'hosts[0].host',
            },
            {
                title: '问题',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'description',
            },
            {
                title: '严重级别',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'priority',
                sorter: (a, b) => { return a.priority.localeCompare(b.priority) },
            },
            {
                title: '发生时间',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'lastchange',
            },
            {
                title: '确认',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'lastEvent.acknowledged',
                render: (text, record, index) => {
                    if (text === '1') {
                        return (<div>是</div>);
                    } else if (text === '0') {
                        return (<div>否</div>);
                    }
                },
            },
            {
                title: '确认信息',
                className: 'cell',
                colSpan: 1,
                dataIndex: 'lastEvent.acknowledges[0].message',
                render: (text, record, index) => {
                    if (text) {
                        return (<div>{text}</div>);
                    } else {
                        return (<div>-</div>);
                    }
                },
            }
        ];

        return (
            <div>
              <Table
                rowKey={record => record.triggerid}
                columns={columns}
                dataSource={this.state.tData}
                pagination={false}
                size="middle"
                bordered
              />
            </div>
        );
    }
}


export default AlertTable;
