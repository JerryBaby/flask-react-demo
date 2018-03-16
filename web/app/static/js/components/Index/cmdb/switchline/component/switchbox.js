import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {Button, Form, Input} from 'antd';
import ResultCard from './result';


const FormItem = Form.Item;


class SwitchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: [],
            failed: [],
            title: '',
            result: '',
        };
    }

    onSwitchVK1() {
        this.setState({
            title: '执行结果 (切换线路: VK-1)',
        });

        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
            } else {
                let data = JSON.stringify(values);

                fetch('/cmdb_api/switch_vk1', {
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
                        this.setState({
                            result: data.result,
                        });
                    } else {
                        this.setState({
                            success: data.result.success,
                            failed: data.result.failed,
                        });
                    }
                }).catch((e) => {
                    this.setState({
                        result: e,
                    });
                });
            }
        });
    }

    onSwitchVK2() {
        this.setState({
            title: '执行结果 (切换线路: VK-2)',
        });

        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
            } else {
                let data = JSON.stringify(values);

                fetch('/cmdb_api/switch_vk2', {
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
                        this.setState({
                            result: data.result,
                        });
                    } else {
                        this.setState({
                            success: data.result.success,
                            failed: data.result.failed,
                        });
                    }
                }).catch((e) => {
                    this.setState({
                        result: e,
                    });
                });
            }
        });
    }

    onSwitchDB2() {
        this.setState({
            title: '执行结果 (切换线路: DB-2)',
        });

        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
            } else {
                let data = JSON.stringify(values);

                fetch('/cmdb_api/switch_db2', {
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
                        this.setState({
                            result: data.result,
                        });
                    } else {
                        this.setState({
                            success: data.result.success,
                            failed: data.result.failed,
                        });
                    }
                }).catch((e) => {
                    this.setState({
                        result: e,
                    });
                });
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };

        const { getFieldDecorator } = this.props.form;

        return (
            <div>
              <Form layout="horizontal">
                <FormItem
                  {...formItemLayout}
                  label="课程ID"
                >
                  {getFieldDecorator('classid', {
                      rules: [{ required: true, message: 'Please input classID!' }],
                  })(
                      <Input type="textarea" placeholder="输入 classID，每行一个" rows={4} />
                  )}
                </FormItem>
                <FormItem wrapperCol={{ span: 10, offset: 10 }}>
                  <Button type="primary" htmlType="submit" onClick={this.onSwitchVK1.bind(this)}>VK 1</Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button type="primary" htmlType="submit" onClick={this.onSwitchVK2.bind(this)}>VK 2</Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button type="primary" htmlType="submit" onClick={this.onSwitchDB2.bind(this)}>DB 2</Button>
                </FormItem>
              </Form>
              <ResultCard
                success={this.state.success}
                failed={this.state.failed}
                title={this.state.title}
                result={this.state.result}
              />
            </div>
        )
    }
}


const WrapperSwitchBox = Form.create()(SwitchBox);


export default WrapperSwitchBox;
