import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {Card} from 'antd';


class ResultCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const title = this.props.title;
        const result = this.props.result ? this.props.result : null;
        const success = this.props.success;
        let resSuccess = [];
        resSuccess.push(<div key="yes"><h4>执行成功: </h4></div>)
        this.props.success.forEach((value, index) => {
            resSuccess.push(<div key={index}>{value}</div>);
        });
        if (resSuccess.length == 1) {
            resSuccess = null;
        }


        const failed = this.props.failed;
        let resFailed = [];
        resFailed.push(<div key="no"><h4>执行失败: </h4></div>)
        this.props.failed.forEach((value, index) => {
            resFailed.push(<div key={index}>{value}</div>);
        });
        if (resFailed.length == 1) {
            resFailed = null;
        }


        return (
            <Card bordered={false} title={title}>
              {result}
              {resFailed}
              {resSuccess}
            </Card>
        )
    }
}


export default ResultCard;
