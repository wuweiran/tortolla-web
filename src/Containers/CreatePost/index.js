import React from "react";
import { Form, Input, Button, message } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import { loadLoginUserToken, isLogin } from "../../User";
import { loadLocalePref } from "../../locale";
import { FormattedMessage } from "react-intl";

export class NormalPostForm extends React.Component {
  state = {
    loading: false,
  };

  onFinish = (values) => {
    this.setState({ loading: true });
    fetch("/posts/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: loadLoginUserToken(),
        title: values.title,
        body: values.body,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ loading: false });
        if (responseJson.status === 1) {
          message.info("Post failed!");
        } else {
          message.info("Post succeeded!");
          this.props.onComplete();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <Form onFinish={this.onFinish}>
        <Form.Item
          name="title"
          label={<FormattedMessage id="post.title" />}
          rules={[{ required: true, min: 5 }]}
        >
          <Input placeholder="My Post Title" />
        </Form.Item>
        <Form.Item
          name="body"
          label={<FormattedMessage id="post.content" />}
          getValueFromEvent={(_event, editor) => {
            return editor.getData();
          }}
          valuePropName="data"
          rules={[{ required: true }]}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              language: loadLocalePref(),
              ckfinder: {
                uploadUrl: "/posts/upload_image",
              },
            }}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              // const data = editor.getData();
              // console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
              // console.log("Blur.", editor);
            }}
            onFocus={(event, editor) => {
              // console.log("Focus.", editor);
            }}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          loading={this.state.loading}
        >
          {<FormattedMessage id="post.act.create" />}
        </Button>
      </Form>
    );
  }
}

export default class CreatePost extends React.Component {
  onComplete = () => {
    window.location.reload();
  };
  render() {
    if (!isLogin()) {
      return <div>Login first, please.</div>;
    }
    return <NormalPostForm onComplete={this.onComplete}></NormalPostForm>;
  }
}
