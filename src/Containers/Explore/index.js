import React from 'react';
import { BackTop, Divider } from 'antd';
import { NormalPost } from '../../Post';

export default class Explore extends React.Component {
    state = {
        posts: []
    };
    
    componentDidMount = () => {
        let t = this;
        fetch("/posts/list_top?top=8", { method: 'GET' }).then(
            function (res) {
                res.json().then(function (list) {
                    t.setState({
                        posts: list
                    });
                }
                )
            });
    }
    render() {
        return (
            <div>
                <BackTop />
                {this.state.posts.map((postId, i) =>
                    <div key={i}>
                        <NormalPost
                            postId={postId}>
                        </NormalPost>
                        <Divider />
                    </div>
                )}
            </div>
        )
    }
}