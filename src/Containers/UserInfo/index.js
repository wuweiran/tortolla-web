import React from 'react';
import { Descriptions, Badge, Skeleton } from 'antd';
import { loginUser } from '../../User';

export default class Explore extends React.Component {

    state = {
        user: null,
        loading: true,
    }

    componentDidMount = () => {
        const { userId } = this.props;
        if (userId == null) {
            this.setState({ user: loginUser(), loading: false });
        }
    }
    render() {
        const { user, loading } = this.state;
        return (
            <Skeleton loading={loading}>
                <Descriptions title="User Info" bordered>
                    <Descriptions.Item label="Universal ID">{user && user.id}</Descriptions.Item>
                    <Descriptions.Item label="Username">{user && user.username}</Descriptions.Item>
                    <Descriptions.Item label="Full name">{user && user.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Created time">
                        {user && new Date(user.createdTime).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={2}>
                        <Badge status="processing" text="Active" />
                    </Descriptions.Item>
                </Descriptions>
            </Skeleton>
        )
    }
}