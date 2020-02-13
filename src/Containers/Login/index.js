import React from 'react';
import cookie from 'react-cookies';
import { Form, Icon, Input, Button, Checkbox, Modal, message } from 'antd';
import { saveLoginUserFromToken } from '../../User';

class NormalLoginForm extends React.Component {
    state = {
        loading: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                fetch('/bloggers/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ loading: false });
                        if (responseJson.status === 1) {
                            message.info("Login failed");
                        } else {
                            message.info("Login succeeded!");
                            cookie.save("token", responseJson.resultBody);
                            saveLoginUserFromToken(responseJson.resultBody, this.props.onComplete);
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                        console.error(error);
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: "Please input your username!" }],
                    })(
                        <Input
                            prefix={<Icon type="user" />}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" />}
                            type="password"
                            placeholder="Password"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>Remember me</Checkbox>)}
                    <a href="" style={{ float: 'right' }}>
                        Forgot password?
                    </a>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const LoginForm = Form.create()(NormalLoginForm);

class NormalRegisterForm extends React.Component {
    state = {
        confirmDirty: false,
        loading: false,
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (_rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                fetch('/bloggers/register', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                        realname: values.realname,
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ loading: false });
                        if (responseJson.status === 1) {
                            message.log("Register failed!");
                        } else {
                            cookie.save("token", responseJson.resultBody);
                            saveLoginUserFromToken(responseJson.resultBody, this.props.onComplete);
                        }
                    })
                    .catch((error) => {
                        this.setState({ loading: false });
                        console.error(error);
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item label="Username">
                    {getFieldDecorator('username', {
                        rules: [
                            { required: true, message: 'Please input your username!' },
                            { max: 20, min: 6, message: "Must between 6-20 characters!" },
                        ],
                    })(
                        <Input
                            prefix={<Icon type="user" />}
                        />,
                    )}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true, message: 'Please input your Password!'
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                        ],
                    })(
                        <Input.Password
                            prefix={<Icon type="lock" />}
                        />,
                    )}
                </Form.Item>
                <Form.Item label="Confirm password" hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                        ],
                    })(<Input.Password
                        onBlur={this.handleConfirmBlur}
                        prefix={<Icon type="check" />}
                    />)}
                </Form.Item>
                <Form.Item label="Real name">
                    {getFieldDecorator('realname')
                        (<Input
                            prefix={<Icon type="contacts" />}
                        />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const RegisterForm = Form.create()(NormalRegisterForm);

export class LoginButton extends React.Component {
    state = {
        visible: false,
        isLogin: true,
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleClick = e => {
        this.setState({
            visible: true,
        });
    }

    toggle = () => {
        this.setState({ isLogin: !this.state.isLogin });
    }

    onComplete = () => {
        this.setState({ visible: false });
        window.location.reload();
    }

    render() {
        const { type } = this.props;
        const { visible, isLogin } = this.state;
        if (isLogin) {
            return (
                <span>
                    <Button type={type} onClick={this.handleClick}>
                        Login/Register
                    </Button>
                    <Modal
                        visible={visible}
                        title="Login"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="toggle" onClick={this.toggle} type='link'>Register now!</Button>,
                            <Button key="back" onClick={this.handleCancel}>Back</Button>,
                        ]}
                    >
                        <LoginForm onComplete={this.onComplete}></LoginForm>
                    </Modal>
                </span>
            )
        } else {
            return (
                <span>
                    <Button type={type} onClick={this.handleClick}>
                        Login/Register
                    </Button>
                    <Modal
                        visible={visible}
                        title="Register"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="toggle" onClick={this.toggle} type='link'>Already have an account? Login</Button>,
                            <Button key="back" onClick={this.handleCancel}>Back</Button>,
                        ]}
                    >
                        <RegisterForm onComplete={this.onComplete}></RegisterForm>
                    </Modal>
                </span>
            )
        }

    }
}
