import React from "react";
import ReactDOM from "react-dom";
import Zmage from "react-zmage";
import { Card, Tooltip, Skeleton, Menu, Dropdown, Modal, Space } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  StarOutlined,
  EditOutlined,
  SettingOutlined,
  DeleteOutlined,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import { loginUser, isLogin } from "../User";

export class NormalPost extends React.Component {
  unmounted = false;

  state = {
    loading: true,
    authorName: "",
    title: "",
    createdTime: "",
    content: "",
    authorId: -1,
    deleteModalVisible: false,
    deleteModalConfirmLoading: false,
  };

  componentDidMount = () => {
    let t = this;
    fetch("/posts/" + this.props.postId, { method: "GET" })
      .then((res) => res.json())
      .then((res) => res.resultBody)
      .then((post) => {
        if (t.unmounted === false) {
          t.setState({
            loading: false,
            title: post.title,
            createdTime: post.createdTime,
            content: post.body,
            authorId: post.authorId,
          });
          fetch("/bloggers/author?id=" + post.authorId, { method: "GET" })
            .then((res) => res.json())
            .then((res) => res.resultBody)
            .then((author) => {
              if (t.unmounted === false) {
                t.setState({
                  authorName: author.username,
                });
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentWillUnmount = () => {
    this.unmounted = true;
  };

  componentDidUpdate = () => {
    let domNode = ReactDOM.findDOMNode(this.refs.self);
    let elements = domNode.querySelectorAll("figure.image");
    for (let i = 0; i < elements.length; i++) {
      let element = elements.item(i);
      let src = element.getElementsByTagName("img").item(0).src;
      let descEle = element.getElementsByTagName("figcaption").item(0);
      if (descEle == null) {
        ReactDOM.render(<Zmage src={src} style={{ width: "100%" }} />, element);
      } else {
        ReactDOM.render(
          <Zmage src={src} alt={descEle.innerText} style={{ width: "100%" }} />,
          element
        );
      }
    }
  };

  onManageMenuClick = (e) => {
    console.log(e);
    switch (e.key) {
      case "edit":
        // TODO
        break;
      case "delete":
        this.setState({
          deleteModalVisible: true,
        });
        break;
      default:
    }
  };

  deleteModalOnOk = () => {
    this.setState({
      deleteModalConfirmLoading: true,
    });
    fetch("/posts/" + this.props.postId, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => res.resultBody)
      .then((_) => {
        this.setState({
          deleteModalVisible: false,
          deleteModalConfirmLoading: false,
        });
        window.location.reload();
      });
  };

  deleteModalOnCancel = () => {
    this.setState({
      deleteModalVisible: false,
    });
  };

  render() {
    const manageMenu = (
      <div>
        <Dropdown
          overlay={
            <Menu onClick={this.onManageMenuClick}>
              <Menu.Item key="edit">
                <EditOutlined />
                <FormattedMessage id="post.act.edit" />
              </Menu.Item>
              <Menu.Item key="delete">
                <DeleteOutlined />
                <FormattedMessage id="post.act.delete" />
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          placement="topCenter"
          disabled={!(isLogin() && loginUser().id === this.state.authorId)}
        >
          <Tooltip
            title={<FormattedMessage id="post.act.manage" />}
            placement="bottom"
          >
            <SettingOutlined key="setting" />
          </Tooltip>
        </Dropdown>
        <Modal
          title={<FormattedMessage id="post.act.delete.confirm.title" />}
          visible={this.state.deleteModalVisible}
          onOk={this.deleteModalOnOk}
          confirmLoading={this.state.deleteModalConfirmLoading}
          onCancel={this.deleteModalOnCancel}
          cancelText={<FormattedMessage id="gen.CANCEL" />}
          okText={<FormattedMessage id="gen.CONFIRM" />}
          closable={false}
        >
          <Space size="middle">
            <QuestionCircleTwoTone
              twoToneColor="#ff4d4f"
              style={{ fontSize: "3em" }}
            />
            <FormattedMessage id="post.act.delete.confirm" />
          </Space>
        </Modal>
      </div>
    );
    const momentVal = moment(this.state.createdTime);
    return (
      <Card
        title={
          <Card.Meta
            title={this.state.title}
            description={this.state.authorName}
          />
        }
        extra={
          <Tooltip title={momentVal.format("YYYY-MM-DD HH:mm:ss")}>
            <span>{momentVal.fromNow()}</span>
          </Tooltip>
        }
        actions={[
          <Tooltip title={<FormattedMessage id="post.act.like" />}>
            <LikeOutlined key="like" />
          </Tooltip>,
          <Tooltip title={<FormattedMessage id="post.act.dislike" />}>
            <DislikeOutlined key="dislike" />
          </Tooltip>,
          <Tooltip title={<FormattedMessage id="post.act.fav" />}>
            <StarOutlined key="fav" />
          </Tooltip>,
          manageMenu,
        ]}
        ref="self"
      >
        <Skeleton loading={this.state.loading} active={true}>
          <p dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
        </Skeleton>
      </Card>
    );
  }
}
