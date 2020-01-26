import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Avatar, Dropdown, Select } from 'antd';
import { LoginButton } from '../Containers/Login';
import Home from '../Containers/Home';
import Explore from '../Containers/Explore';
import CreatePost from '../Containers/CreatePost';
import { isLogin, loginUser, logout } from '../User';

const { Header, Footer, Content } = Layout;

export default class SiteLayout extends React.Component {
    handleSelect = e => {
        const elementMap = {
            "home": <Home/>,
            "explore": <Explore />,
            "create": <CreatePost />,
        }
        ReactDOM.render(elementMap[e.key], document.getElementById('site-content'));
    };

    handleClick = e => {
        console.log(e);
    };


    render() {
        return (
            <Layout>
                <Header>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        onSelect={this.handleSelect}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="home">
                            <Icon type="home" />
                            Home
                        </Menu.Item>
                        <Menu.Item key="explore">
                            <Icon type="compass" />
                            Explore
                        </Menu.Item>
                        <Menu.Item key="create">
                            <Icon type="file-add" />
                            Create Post
                        </Menu.Item>
                        <UserPanel />
                    </Menu>
                </Header>
                <Content>
                    <div id="site-content">
                        Hello!
                    </div>
                </Content>
                <Footer>
                    <Language />
                    ©2019 Midnight1000
                </Footer>
            </Layout>
        )
    }
}

class UserPanel extends React.Component {

    handleClick = e => {
        console.log(e);
        if (e.key === "3") {
            logout();
            window.location.reload();
        }
    }

    menu = (
        <Menu onClick={this.handleClick}>
            <Menu.Item key="0">
                <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                    用户信息
            </a>
            </Menu.Item>
            <Menu.Item key="1">
                <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                    我的收藏
            </a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
                登出
            </Menu.Item>
        </Menu>
    );

    render() {
        if (!isLogin()) {
            return (
                <LoginButton type="link">登录</LoginButton>
            )
        } else {
            return (
                <Dropdown overlay={this.menu} placement="bottomLeft">
                    <span><Avatar shape="square" />
                        {loginUser().username}</span>
                </Dropdown>
            )
        }
    }
}

class Language extends React.Component {
    handleChange = () => {

    }

    render() {
        return (
            <Select
                labelInValue
                defaultValue={{ key: 'en-us' }}
                style={{ width: 120 }}
                onChange={ this.handleChange }
            >
                <Select.Option value="zh-cn">中文(中国)</Select.Option>
                <Select.Option value="en-us">English(US)</Select.Option>
            </Select>
        )
    }
}