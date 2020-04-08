import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
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

    handleClick = e => {
        switch (e.key) {
            case "logout":
                logout();
                window.location.reload();
                break;
            default:
        }
    };

    userMenu = (
        <Menu onClick={this.handleClick}>
            <Menu.Item>
                <Link to={'/user/info'}>
                    User info
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link to={'/user/fav'}>
                    My favorite
                </Link>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">Log out</Menu.Item>
        </Menu>
    );

    render() {
        return (
            <BrowserRouter>
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
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item>
                                <Link to={'/home'}>
                                    <HomeOutlined />
                                    Home
                                </Link>
                            </Menu.Item>
                            <Menu.Item disabled={true}>
                                <Link to={'/post/explore'}>
                                    <CompassOutlined />
                                    Explore
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={'/post/latest'}>
                                    <ShakeOutlined />
                                    Latest
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to={'/post/create'}>
                                    <FileAddOutlined />
                                    Create Post
                                </Link>
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
                        <Switch>
                            <Route exact path='/' component={Empty} />
                            <Route exact path='/home' component={Home} />
                            <Route exact path='/post/explore' component={Explore} />
                            <Route exact path='/post/latest' component={Latest} />
                            <Route exact path='/post/create' component={CreatePost} />
                            <Route exact path='/user/info' component={UserInfo} />
                        </Switch>
                    </Content>
                    <Footer>
                        Tortolla ©2019-2020 Created by Midnight1000
                    <Language />
                    </Footer>
                </Layout>
            </BrowserRouter>
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