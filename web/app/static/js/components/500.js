import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';


class InternalServerError extends Component {
    render() {
        return (
            <div className="error-page">
              <Spin size="large" tip="Internal Server Error ......" />
            </div>
        );
    }
}


ReactDOM.render(
    <InternalServerError />,
    document.getElementById('react-demo')
);
