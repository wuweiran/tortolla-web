import React from 'react';
import ReactDOM from 'react-dom';
import Zmage from 'react-zmage'
import { Card, Tooltip, Skeleton } from 'antd';
import { LikeOutlined, DislikeOutlined, StarOutlined, EditOutlined, SettingOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';

export class NormalPost extends React.Component {

    unmounted = false;

    state = {
        loading: true,
        authorName: '',
        title: '',
        createdTime: '',
        content: '',
    }

    componentDidMount = () => {
        let t = this;
        fetch("/posts?id=" + this.props.postId, { method: 'GET' })
            .then((res) => res.json())
            .then((res) => res.resultBody)
            .then(
                (post) => {
                    if (t.unmounted === false) {
                        t.setState({
                            loading: false,
                            title: post.title,
                            createdTime: post.createdTime,
                            content: post.body,
                        });
                        fetch("/bloggers/author?id=" + post.authorId, { method: 'GET' })
                            .then((res) => res.json())
                            .then((res) => res.resultBody)
                            .then(
                                (author) => {
                                    if (t.unmounted === false) {
                                        t.setState({
                                            authorName: author.username
                                        });
                                    }
                                }
                            )
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
            )
            .catch((error) => {
                console.error(error);
            });

    };

    componentWillUnmount = () => {
        this.unmounted = true;
    }

    componentDidUpdate = () => {
        let domNode = ReactDOM.findDOMNode(this.refs.self);
        let elements = domNode.querySelectorAll("figure.image");
        for (let i = 0; i < elements.length; i++) {
            let element = elements.item(i);
            let src = element.getElementsByTagName("img").item(0).src;
            let descEle = element.getElementsByTagName("figcaption").item(0);
            if (descEle == null) {
                ReactDOM.render(<Zmage src={src} style={{ "maxHeight": "300px" }} />, element);
            } else {
                ReactDOM.render(<Zmage src={src} alt={descEle.innerText} style={{ "maxHeight": "300px" }} />, element);
            }

        }
    }

    render() {
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
                    <Tooltip title={momentVal.format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{momentVal.fromNow()}</span>
                    </Tooltip>
                }
                actions={[
                    <LikeOutlined key="like" />,
                    <DislikeOutlined key="dislike" />,
                    <StarOutlined key="fav" />,
                    <EditOutlined key="edit" />,
                    <SettingOutlined key="setting" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
                ref="self"
            >
                <Skeleton loading={this.state.loading} active={true}>
                    <p dangerouslySetInnerHTML={{ __html: this.state.content }}></p>
                </Skeleton>
            </Card>
        )
    }
}