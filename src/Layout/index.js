import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Select, Empty, Divider } from 'antd';
import { HomeOutlined, ShakeOutlined, CompassOutlined, FileAddOutlined, GlobalOutlined } from '@ant-design/icons';
import { LoginButton } from '../Containers/Login';
import Home from '../Containers/Home';
import Explore from '../Containers/Explore';
import CreatePost from '../Containers/CreatePost';
import Latest from '../Containers/Latest';
import UserInfo from '../Containers/UserInfo';
import { isLogin, loginUser, logout } from '../User';
import logoImg from '../site-logo.png';

const { Header, Footer, Content } = Layout;

export default class SiteLayout extends React.Component {
    state = {
        content: <Empty />
    }

    handleSelect = e => {
        const elementMap = {
            "home": <Home />,
            "explore": <Explore />,
            "create": <CreatePost />,
            "latest": <Latest />,
        }
        this.setState({ content: elementMap[e.key] });
    };

    handleClick = e => {
        switch (e.key) {
            case "1":
                this.setState({ content: <UserInfo /> });
                break;
            case "2":
                this.setState({ content: <Empty /> });
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
                    <div className="logo">
                        <img src={logoImg} alt="Sit Logo" style={{
                            height: "47px",
                            margin: "8px 24px 8px 0",
                            float: "left"
                        }} />
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        onSelect={this.handleSelect}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="home">
                            <HomeOutlined />
                            Home
                        </Menu.Item>
                        <Menu.Item key="explore" disabled={true}>
                            <CompassOutlined />
                            Explore
                        </Menu.Item>
                        <Menu.Item key="latest">
                            <ShakeOutlined />
                            Latest
                        </Menu.Item>
                        <Menu.Item key="create">
                            <FileAddOutlined />
                            Create Post
                        </Menu.Item>
                        <Divider type='vertical' />
                        {isLogin() ?
                            <Dropdown overlay={this.userMenu} placement="bottomLeft">
                                <span><Avatar shape="square" />
                                    {loginUser().username}</span>
                            </Dropdown> :
                            <LoginButton type="link" />}
                    </Menu>
                </Header>
                <Content style={{ padding: '10px 50px' }}>
                    {this.state.content}
                </Content>
                <Footer>
                    Tortolla ©2019-2020 Created by Midnight1000
                    <Language />
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
            <div>
                <GlobalOutlined />
                <Select
                    labelInValue
                    defaultValue={{ key: 'en-us' }}
                    style={{ width: 120 }}
                    onChange={this.handleChange}
                >
                    <Select.Option value="zh-cn">中文(中国)</Select.Option>
                    <Select.Option value="en-us">English(US)</Select.Option>
                </Select>
            </div>

        )
    }
}