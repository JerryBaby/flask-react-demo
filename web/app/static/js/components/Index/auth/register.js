import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Cascader, Checkbox, Col, Form, Icon, Input, Row, Select, Tooltip } from 'antd';


const FormItem = Form.Item;


class RegistrationForm extends Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form:', values);
            }
        });
    }

    handleConfirmBlur(e) {
        const value = e.target.values;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value != form.getFieldValue('password')) {
            callback('Two password that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    checkConfirm(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };

        return (
            <div id="registerpagewrap">
              <p>Sing up to Demo</p>
              <div id="registerwrap">
                <Form className="register-form" onSubmit={this.handleSubmit.bind(this)}>
                  <FormItem {...formItemLayout} label="E-mail" hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: 'This input is not valid E-mail!',
                        }, {
                            required: true, message: 'Please input your E-mail!',
                        }],
                    })(
                        <Input />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Password" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.checkConfirm.bind(this),
                        }],
                    })(
                        <Input type="password" />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="Confirm Password" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.checkPassword.bind(this)
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout}
                    label={(
                        <span>
                          Nickname&nbsp;
                          <Tooltip title="What do you want other to call you?">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                    )}
                    hasFeedback>
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                    })(
                        <Input />
                    )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                  </FormItem>
                </Form>
              </div>
            </div>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);


export default WrappedRegistrationForm;
