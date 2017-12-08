import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Cascader, Form, Input, message, Modal, Radio, Select } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    afterClose() {
        this.props.form.resetFields();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (!values.lanIp) {
                    values.lanIp = '';
                }
                if (!values.wanIp) {
                    values.wanIp = '';
                }
                if (!values.virtualIp) {
                    values.virtualIp = '';
                }

                let data = JSON.stringify(values);

                fetch('/server_api/server_add', {
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
                        message.success('add server ok.');
                        this.props.handleAddServer(data.result);
                        this.setState({
                            visible: false,
                        });
                    }
                }).catch((e) => {
                    console.log('Fetch faield: ', e);
                });
            }
        });
    }

    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    render() {
        const formItemLayout= {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };

        const { getFieldDecorator } = this.props.form;
        const cascaderOptions = this.props.cascadeData.map((c) => {
            return ({
                value: c.platform,
                label: c.platform,
                children: c.region.map((r) => { return ({ value: r, label: r }); }),
            });
        });

        const pattern = /^(\d{1,3}\.){3}\d{1,3}$|(^(\d{1,3}\.){3}\d{1,3}\,){1}((\d{1,3}\.){3}\d{1,3}\,)*(\d{1,3}\.){3}\d{1,3}$/;
        const ipRegExp = new RegExp(pattern);

        return (
            <div>
              <Button type="primary" shape="circle" icon="plus" onClick={this.showModal.bind(this)}></Button>
              <Modal
                afterClose={this.afterClose.bind(this)}
                okText="添加"
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                title="添加服务器"
                visible={this.state.visible}
                wrapClassName="vertical-center-modal"
              >
                <Form layout="horizontal">
                  <FormItem {...formItemLayout} label="服务器: ">
                    {getFieldDecorator('serverName', {
                        rules: [{ required: true, message: 'Please input server name!' }],
                    })(
                        <Input placeholder="主机名" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="内网IP: ">
                    {getFieldDecorator('lanIp', {
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="内网地址，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="公网IP: ">
                    {getFieldDecorator('wanIp', {
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="公网地址，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="VIP: ">
                    {getFieldDecorator('virtualIp', {
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="虚 IP，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="角色: ">
                    {getFieldDecorator('role', {
                        rules: [{ required: true, message: 'Please select server role!' }],
                    })(
                        <Select>
                          {this.props.roleData.map((r) => <Option key={r.value}>{r.value}</Option>)}
                        </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="云平台: ">
                    {getFieldDecorator('platform', {
                        rules: [{ required: true, message: 'Please select platform!' }],
                    })(
                        <Cascader options={cascaderOptions} placeholder="Please select platform." expandTrigger="hover" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="属性: ">
                    {getFieldDecorator('attribute', {
                        rules: [{ required: true, message: 'Pleace select server type!' }],
                    })(
                        <RadioGroup>
                          <Radio value="Virtual">Virtual</Radio>
                          <Radio value="Physical">Physical</Radio>
                        </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="状态: ">
                    {getFieldDecorator('status', {
                        rules: [{ required: true, message: 'Please select server status!' }],
                    })(
                        <RadioGroup>
                          <Radio value="在线">在线</Radio>
                          <Radio value="下线">下线</Radio>
                        </RadioGroup>
                    )}
                  </FormItem>
                </Form>
              </Modal>
            </div>
        );
    }
}

let ServerAddModal = Form.create()(ModalDialog);

export default ServerAddModal;
