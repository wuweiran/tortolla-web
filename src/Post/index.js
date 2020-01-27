import React from 'react';
import ReactDOM from 'react-dom';
import Zmage from 'react-zmage'
import { Card, Icon } from 'antd';

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

    componentDidUpdate = () => {
        let domNode = ReactDOM.findDOMNode(this.refs.self);
        let elements = domNode.querySelectorAll("figure.image");
        for (let i=0;i<elements.length;i++) {
            let element = elements.item(i);
            let src = element.getElementsByTagName("img").item(0).src;
            let descEle = element.getElementsByTagName("figcaption").item(0);
            if (descEle == null) {
                ReactDOM.render(<Zmage src={src} style={{"max-height":"300px"}}/>, element);
            } else {
                ReactDOM.render(<Zmage src={src} alt={descEle.innerText} style={{"max-height":"300px"}}/>, element);
            }
            
        }
    }

    render() {
        return (
            <Card
                title={this.state.title}
                extra={new Date(this.state.createdTime).toLocaleString()}
                actions={[
                    <Icon type="like" key="like" />,
                    <Icon type="dislike" key="dislike" />,
                    <Icon type="star" key="fav" />,
                    <Icon type="edit" key="edit" />,
                    <Icon type="setting" key="setting" />,
                    <Icon type="ellipsis" key="ellipsis" />,
                  ]}
                ref="self"
            >
                <p dangerouslySetInnerHTML={{__html: this.state.content}}></p>
            </Card>
        )
    }
}