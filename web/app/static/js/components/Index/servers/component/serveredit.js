import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Cascader, Form, Icon, Input, message, Modal, Popconfirm, Radio, Select, Tooltip } from 'antd';


const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class ModalDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: '',
            serverName: '',
            lanIp: '',
            wanIp: '',
            virtualIp: '',
            role: '',
            platform: [],
            attribute: '',
            status: '',
            visible: false,
        };
    }

    showModal() {
        const item = this.props.passItem();
        let lan = item.ip.filter((item) => item.indexOf('内网') != -1);
        let wan = item.ip.filter((item) => item.indexOf('公网') != -1);
        let virtual = item.ip.filter((item) => item.indexOf('VIP') != -1);

        let lanIp = lan.length === 0
                    ? ''
                    : lan.map((item) => item.split(' ')[0]).reduce((prev, next) => prev + ',' + next);
        let wanIp = wan.length === 0
                    ? ''
                    : wan.map((item) => item.split(' ')[0]).reduce((prev, next) => prev + ',' + next);
        let virtualIp = virtual.length === 0
                    ? ''
                    : virtual.map((item) => item.split(' ')[0]).reduce((prev, next) => prev + ',' + next);

        this.setState({
            key: item.key,
            serverName: item.hostname,
            lanIp: lanIp,
            wanIp: wanIp,
            virtualIp: virtualIp,
            role: item.role,
            platform: [item.platform, item.region],
            attribute: item.attribute,
            status: item.status,
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
                values.key = this.state.key;
                let data = JSON.stringify(values);

                fetch('/server_api/server_modify', {
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
                        message.success('edit server ok.');
                        this.props.handleEditServer(data.result);
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
            <span>
              <ButtonGroup>
                <Tooltip title="编辑">
                  <Button type="primary" size="small" ghost onClick={this.showModal.bind(this)}>
                    <Icon type="edit" />
                  </Button>
                </Tooltip>
                <Popconfirm title="确认删除" onConfirm={this.props.handleConfirm}>
                  <Tooltip title="删除">
                    <Button type="danger" size="small" ghost>
                      <Icon type="delete" />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </ButtonGroup>
              <Modal
                afterClose={this.afterClose.bind(this)}
                okText="修改"
                onOk={this.handleSubmit.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                title="修改服务器"
                visible={this.state.visible}
                wrapClassName="vertical-center-modal"
              >
                <Form layout="horizontal">
                  <FormItem {...formItemLayout} label="服务器: ">
                    {getFieldDecorator('serverName', {
                        initialValue: this.state.serverName,
                        rules: [{ required: true, message: 'Please input server name!' }],
                    })(
                        <Input placeholder="主机名" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="内网IP: ">
                    {getFieldDecorator('lanIp', {
                        initialValue: this.state.lanIp,
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="内网地址，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="公网IP: ">
                    {getFieldDecorator('wanIp', {
                        initialValue: this.state.wanIp,
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="公网地址，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="VIP: ">
                    {getFieldDecorator('virtualIp', {
                        initialValue: this.state.virtualIp,
                        rules: [{ pattern: ipRegExp, message: 'Invalid ip address!' }],
                        validateTrigger: 'onBlur',
                    })(
                        <Input placeholder="虚 IP，多个IP用 ',' 分隔" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="角色: ">
                    {getFieldDecorator('role', {
                        initialValue: this.state.role,
                        rules: [{ required: true, message: 'Please select server role!' }],
                    })(
                        <Select>
                          {this.props.roleData.map((r) => <Option key={r.value}>{r.value}</Option>)}
                        </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="云平台: ">
                    {getFieldDecorator('platform', {
                        initialValue: this.state.platform,
                        rules: [{ required: true, message: 'Please select platform!' }],
                    })(
                        <Cascader options={cascaderOptions} placeholder="Please select platform." expandTrigger="hover" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="属性: ">
                    {getFieldDecorator('attribute', {
                        initialValue: this.state.attribute,
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
                        initialValue: this.state.status,
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
            </span>
        );
    }
}

let ServerEditModal = Form.create()(ModalDialog);

export default ServerEditModal;
