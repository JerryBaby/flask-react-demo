import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';


class NotFound extends Component {
    render() {
        return (
            <div className="error-page">
              <Spin size="large" tip="404 Not Found ......" />
            </div>
        );
    }
}


ReactDOM.render(
    <NotFound />,
    document.getElementById('react-demo')
);
