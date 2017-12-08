import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form, Icon, Input, message } from 'antd';


const FormItem = Form.Item;


class LoginForm extends Component {
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err);
            } else {
                let data = JSON.stringify(values);

                fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // keep cookie
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
                        location.href = '/';
                    }
                }).catch((e) => {
                    console.log('Fetch failed: ', e);
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div id="loginpagewrap">
              <p>Sign in to Demo</p>
              <div id="loginWrap">
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                  <FormItem>
                    {getFieldDecorator('userName', {
                      rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                      <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                      <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: false,
                    })(
                      <Checkbox>Remember me</Checkbox>
                    )}
                    <a className="login-form-forgot" href="#">Forgot password</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      Log in
                    </Button>
                    Or <a href="register">register now!</a>
                  </FormItem>
                </Form>
              </div>
            </div>
        );
    }
}


const WrapperLoginForm = Form.create()(LoginForm);

ReactDOM.render(<WrapperLoginForm />, document.getElementById('react-demo'));
