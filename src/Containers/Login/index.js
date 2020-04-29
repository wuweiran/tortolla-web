import React from 'react';
import { Form, Input, Button, Checkbox, Modal, message } from 'antd';
import { UserOutlined, LockOutlined, CheckOutlined, ContactsOutlined } from '@ant-design/icons';
import { saveLoginUserToken, saveLoginUserFromToken } from '../../User';
import { FormattedMessage } from 'react-intl';

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
                    saveLoginUserToken(responseJson.resultBody);
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
                <Form.Item
                    name='username'
                    label={<FormattedMessage id="auth.USERNAME" />}
                    rules={[{ required: true}]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name='password'
                    label={<FormattedMessage id="auth.PASSWORD" />}
                    rules={[{ required: true}]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name='remember' valuePropName='checked' noStyle>
                        <Checkbox><FormattedMessage id="auth.REMEMBER" /></Checkbox>
                    </Form.Item>
                    <a href="/user/register" style={{ float: 'right' }}>
                        <FormattedMessage id="auth.FORGOT" />
                    </a>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                        <FormattedMessage id="auth.LOG_IN" />
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
                realName: values.realName,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ loading: false });
                if (responseJson.status === 1) {
                    message.info("Register failed!");
                } else {
                    saveLoginUserToken(responseJson.resultBody);
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
                <Form.Item
                    label={<FormattedMessage id="auth.USERNAME" />}
                    name='username'
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { max: 20, min: 6, message: "Must between 6-20 characters!" },
                    ]}>

                    <Input
                        prefix={<UserOutlined />}
                    />
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="auth.PASSWORD" />} hasFeedback
                    name='password'
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
                <Form.Item
                    label={<FormattedMessage id="auth.PASSWORD_CONFIRM" />} hasFeedback 
                    name='confirm'
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
                <Form.Item label={<FormattedMessage id="auth.REAL_NAME" />} name='realName'>
                    <Input
                        prefix={<ContactsOutlined />}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                        <FormattedMessage id="auth.REGISTER" />
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
                        <FormattedMessage id="auth.LOGIN" />/{<FormattedMessage id="auth.REGISTER" />}
                    </Button>
                    <Modal
                        visible={visible}
                        title="Login"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="toggle" onClick={this.toggle} type='link'><FormattedMessage id="auth.REGISTER" />!</Button>,
                            <Button key="back" onClick={this.handleCancel}><FormattedMessage id="gen.BACK" /></Button>,
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
