import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Menu, Icon, Avatar, Dropdown, Select } from 'antd';
import { LoginButton } from '../Containers/Login';
import Home from '../Containers/Home';
import Explore from '../Containers/Explore';
import CreatePost from '../Containers/CreatePost';
import UserInfo from '../Containers/UserInfo';
import { isLogin, loginUser, logout } from '../User';

const { Header, Footer, Content } = Layout;

export default class SiteLayout extends React.Component {
    handleSelect = e => {
        const elementMap = {
            "home": <Home />,
            "explore": <Explore />,
            "create": <CreatePost />,
        }
        ReactDOM.render(elementMap[e.key], document.getElementById('site-content'));
    };

    handleClick = e => {
        switch (e.key) {
            case "1":
                ReactDOM.render(<UserInfo />, document.getElementById('site-content'));
                break;
            case "3":
                logout();
                window.location.reload();
                break;
            default:
                console.error(e.key);
        }
    };

    userMenu = (
        <Menu onClick={this.handleClick}>
            <Menu.Item key="1">User Info</Menu.Item>
            <Menu.Item key="2">我的收藏</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">Log out</Menu.Item>
        </Menu>
    );

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
                        {isLogin() ?
                            <Dropdown overlay={this.userMenu} placement="bottomLeft">
                                <span><Avatar shape="square" />
                                    {loginUser().username}</span>
                            </Dropdown> :
                            <LoginButton type="link" />}
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <div id="site-content">
                        Hello!
                    </div>
                </Content>
                <Footer>
                    <Language />
                    Tortolla ©2019 Created by Midnight1000
                </Footer>
            </Layout>
        )
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
                onChange={this.handleChange}
            >
                <Select.Option value="zh-cn">中文(中国)</Select.Option>
                <Select.Option value="en-us">English(US)</Select.Option>
            </Select>
        )
    }
}