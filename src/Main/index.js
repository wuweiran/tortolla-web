import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { Layout, Menu, Empty, Select, ConfigProvider } from "antd";
import {
  HomeOutlined,
  ShakeOutlined,
  CompassOutlined,
  FileAddOutlined,
  GlobalOutlined,
  UserOutlined,
  InfoOutlined,
  StarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { LoginButton } from "../Containers/Login";
import Home from "../Containers/Home";
import Explore from "../Containers/Explore";
import CreatePost from "../Containers/CreatePost";
import Latest from "../Containers/Latest";
import UserInfo from "../Containers/UserInfo";
import { isLogin, loginUser, logout } from "../User";
import logoImg from "../site-logo.png";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import momentLocale from "moment/locale/zh-cn";
import { IntlProvider, FormattedMessage } from "react-intl";
import { saveLocalePref, loadLocalePref } from "../locale";
import zh_CN from "../locale/zh-cn.js";
import en_US from "../locale/en-us.js";

moment.updateLocale("zh-cn", momentLocale);

const { Header, Footer, Content, Sider } = Layout;

class Language extends React.Component {
  render() {
    const { handleChange } = this.props;
    const { defaultLocale } = this.props;
    return (
      <div>
        <GlobalOutlined />
        <Select
          labelInValue
          defaultValue={{ key: defaultLocale }}
          style={{ width: 120 }}
          onChange={handleChange}
        >
          <Select.Option value="zh-cn">中文(中国)</Select.Option>
          <Select.Option value="en-us">English(US)</Select.Option>
        </Select>
      </div>
    );
  }
}
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    let localeString = loadLocalePref();
    if (localeString === undefined) {
      localeString = "en-us";
      saveLocalePref(localeString);
    }
    this.state = {
      locale: localeString,
    };
    moment.locale(localeString);
  }

  changeLocale = (e) => {
    this.setState({
      locale: e.value,
    });
    saveLocalePref(e.value);
    moment.locale(e.value);
  };

  convertLocaleString = (localeString) => {
    switch (localeString) {
      case "en-us":
        return enUS;
      case "zh-cn":
        return zhCN;
      default:
        return enUS;
    }
  };

  handleSelect = (e) => {
    switch (e.key) {
      case "logout":
        logout();
        window.location.reload();
        break;
      default:
    }
  };

  render() {
    let messages = {};
    messages["en-us"] = en_US;
    messages["zh-cn"] = zh_CN;
    return (
      <IntlProvider
        locale={this.state.locale}
        messages={messages[this.state.locale]}
      >
        <ConfigProvider locale={this.convertLocaleString(this.state.locale)}>
          <BrowserRouter>
            <Layout>
              <Header
                style={{
                  zIndex: 1,
                  width: "100%",
                  position: "fixed",
                }}
              >
                <div className="logo">
                  <a href="/home">
                    <img
                      src={logoImg}
                      alt="Site Logo"
                      style={{
                        height: "48px",
                        margin: "8px 0 8px 0",
                        float: "left",
                      }}
                    />
                  </a>
                </div>
                <Language
                  handleChange={this.changeLocale}
                  defaultLocale={this.state.locale}
                />
              </Header>
              <Layout style={{ marginTop: 64 }}>
                <Sider theme="light"
                  style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                  }}
                >
                  <Menu
                    theme="light"
                    mode="inline"
                    style={{ lineHeight: "64px" }}
                    onSelect={this.handleSelect}
                  >
                    {isLogin() ? (
                      <Menu.SubMenu
                        title={loginUser().username}
                        icon={<UserOutlined />}
                      >
                        <Menu.Item>
                          <Link to={"/user/info"}>
                            <InfoOutlined />
                            <FormattedMessage id="nav.user.INFO" />
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to={"/user/fav"}>
                            <StarOutlined />
                            <FormattedMessage id="nav.user.FAV" />
                          </Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="logout" icon={<LogoutOutlined />}>
                          <FormattedMessage id="nav.user.LOGOUT" />
                        </Menu.Item>
                      </Menu.SubMenu>
                    ) : (
                      <Menu.Item>
                        <LoginButton type="link" />
                      </Menu.Item>
                    )}
                    <Menu.Item key="/home">
                      <Link to={"/home"}>
                        <HomeOutlined />
                        <FormattedMessage id="nav.HOME" />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/post/explore" disabled={true}>
                      <Link to={"/post/explore"}>
                        <CompassOutlined />
                        <FormattedMessage id="nav.EXPLORE" />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/post/latest">
                      <Link to={"/post/latest"}>
                        <ShakeOutlined />
                        <FormattedMessage id="nav.LATEST" />
                      </Link>
                    </Menu.Item>
                    <Menu.Item key={"/post/create"}>
                      <Link to={"/post/create"}>
                        <FileAddOutlined />
                        <FormattedMessage id="nav.CREATE_POST" />
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                  <Content
                    style={{
                      padding: 24,
                      margin: 0,
                      minHeight: 280,
                    }}
                  >
                    <Switch>
                      <Route exact path="/" component={Empty} />
                      <Route exact path="/home" component={Home} />
                      <Route exact path="/post/explore" component={Explore} />
                      <Route exact path="/post/latest" component={Latest} />
                      <Route exact path="/post/create" component={CreatePost} />
                      <Route exact path="/user/info" component={UserInfo} />
                    </Switch>
                  </Content>
                  <Footer style={{ textAlign: "center" }}>
                    Tortolla ©2019-2020 Created by Midnight1000
                  </Footer>
                </Layout>
              </Layout>
            </Layout>
          </BrowserRouter>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}
