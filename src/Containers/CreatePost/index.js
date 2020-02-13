import React from 'react';
import { Form, Input, Button, message } from 'antd';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { loginUserToken, isLogin } from '../../User';

export class NormalPostForm extends React.Component {

    state = {
        loading: false,
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true });
                fetch('/posts/create', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: loginUserToken(),
                        title: values.title,
                        body: values.body,
                    }),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ loading: false });
                        if (responseJson.status === 1) {
                            message.log("Post failed!");
                        } else {
                            message.log("Post succeeded!");
                            this.props.onComplete();
                        }
                    })
                    .catch((error) => {
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
                    {getFieldDecorator('title', {
                        rules: [{ required: true, min: 5, message: 'Length < 5!' }],
                    })(
                        <Input
                            placeholder="My Post Title"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('body', {
                        getValueFromEvent: (_event, editor) => {
                            return editor.getData();
                        },
                        valuePropName: "data",
                        initialValue: "<p>Hello from CKEditor 5!</p>",
                        rules: [{ required: true, message: 'Must write something!' }],
                    })(
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                language: 'en-us',
                                ckfinder: {
                                    uploadUrl: "/posts/upload_image"
                                }
                            }}
                            onInit={editor => {
                                // You can store the "editor" and use when it is needed.
                                //console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                //const data = editor.getData();
                                //console.log({ event, editor, data });
                            }}
                            onBlur={(event, editor) => {
                                //console.log('Blur.', editor);
                            }}
                            onFocus={(event, editor) => {
                                //console.log('Focus.', editor);
                            }}
                        />,
                    )}
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={this.state.loading}>
                    Post
                </Button>
            </Form>
        )
    }
}

export const PostForm = Form.create()(NormalPostForm);

export default class CreatePost extends React.Component {
    onComplete = () => {
        window.location.reload();
    }
    render() {
        if (!isLogin()) {
            return (
                <div>Login first, please.</div>
            )
        }
        return (
            <PostForm onComplete={this.onComplete}></PostForm>
        )
    }
}