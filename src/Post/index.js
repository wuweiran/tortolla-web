import React from 'react';
import { Card } from 'antd';

export class NormalPost extends React.Component {

    state = {
        title: '',
        createdTime: '',
        content: '',
    }

    componentDidMount = () => {
        let t = this;
        fetch("/posts?id=" + this.props.postId, { method: 'GET' })
            .then((res) => res.json())
            .then(
                (post) => {
                    t.setState({
                        title: post.title,
                        createdTime: post.createdTime,
                        content: post.body,
                    });
                }
            )
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <Card
                title={this.state.title}
                extra={new Date(this.state.createdTime).toLocaleString()}
            >
                <p dangerouslySetInnerHTML={{__html: this.state.content}}></p>
            </Card>
        )
    }
}