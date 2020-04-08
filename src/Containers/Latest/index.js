import React from 'react';
import { BackTop, Space, Pagination, Spin, Divider } from 'antd';
import { NormalPost } from '../../Post';

class PostList extends React.Component {
    render() {
        const { posts } = this.props;
        return (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {posts.map((postId, i) =>
                    <NormalPost
                        postId={postId}>
                    </NormalPost>
                )}
                <Divider />
            </Space>
        )
    }
}

export default class Latest extends React.Component {
    state = {
        posts: [],
        current: 1,
        pageSize: 10,
        total: 0,
        disabled: false,
    };

    componentDidMount = () => {
        this.update(this.state.current, this.state.pageSize);
    }

    update = (current, pageSize) => {
        this.setState({
            posts: [],
            disabled: true,
        });
        let t = this;
        fetch("/posts/list_top?pageNum=" + current + "&pageSize=" + pageSize, { method: 'GET' })
            .then(
                function (res) {
                    res.json().then(function (pageInfo) {
                        t.setState({
                            posts: pageInfo.list,
                            total: pageInfo.total,
                            current: pageInfo.pageNum,
                            pageSize: pageInfo.pageSize,
                            disabled: false,
                        });
                    }
                    )
                });
    }

    onChange = (page, pageSize) => {
        this.update(page, pageSize);
    }

    onShowSizeChange = (current, size) => {
        this.update(1, size);
    }

    render() {
        return (
            <div>
                <BackTop />
                <Spin spinning={this.state.disabled} size="large">
                    <PostList posts={this.state.posts} />
                </Spin>
                <Pagination
                    current={this.state.current}
                    disabled={this.state.disabled}
                    pageSize={this.state.pageSize}
                    showQuickJumper={true}
                    showSizeChanger={true}
                    total={this.state.total}
                    onChange={this.onChange}
                    onShowSizeChange={this.onShowSizeChange}
                />
            </div>
        )
    }
}