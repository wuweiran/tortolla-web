import React from 'react';
import cookie from 'react-cookies';
import { Form, Input, Button, Checkbox, Modal, message } from 'antd';
import { UserOutlined, LockOutlined, CheckOutlined, ContactsOutlined } from '@ant-design/icons';
import { saveLoginUserFromToken } from '../../User';

class NormalLoginForm extends React.Component {
    state = {
        loading: false,
    };

    onFinish = values => {
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
    };

    render() {
        return (
            <Form onFinish={this.onFinish} initialValues={{ remember: true }}>
                <Form.Item name='username' rules={[{ required: true, message: "Please input your username!" }]}>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item name='password' rules={[{ required: true, message: 'Please input your Password!' }]}>
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name='remember' valuePropName='checked' noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <a href="" style={{ float: 'right' }}>
                        Forgot password?
                    </a>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

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

    onFinish = values => {
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
                    message.info("Register failed!");
                } else {
                    cookie.save("token", responseJson.resultBody);
                    saveLoginUserFromToken(responseJson.resultBody, this.props.onComplete);
                }
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    };

    render() {
        return (
            <Form onFinish={this.onFinish}>
                <Form.Item label="Username"
                    name='username'
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { max: 20, min: 6, message: "Must between 6-20 characters!" },
                    ]}>

                    <Input
                        prefix={<UserOutlined />}
                    />
                </Form.Item>
                <Form.Item label="Password" hasFeedback name='password'
                    rules={[
                        {
                            required: true, message: 'Please input your Password!'
                        },
                        {
                            validator: this.validateToNextPassword,
                        },
                    ]}>
                    <Input.Password
                        prefix={<LockOutlined />}
                    />
                </Form.Item>
                <Form.Item label="Confirm password" hasFeedback name='confirm'
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: this.compareToFirstPassword,
                        },
                    ]}>
                    <Input.Password
                        onBlur={this.handleConfirmBlur}
                        prefix={<CheckOutlined />}
                    />
                </Form.Item>
                <Form.Item label="Real name" name='realname'>
                    <Input
                        prefix={<ContactsOutlined />}
                    />
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
                        <NormalLoginForm onComplete={this.onComplete}></NormalLoginForm>
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
                        <NormalRegisterForm onComplete={this.onComplete}></NormalRegisterForm>
                    </Modal>
                </span>
            )
        }

    }
}
