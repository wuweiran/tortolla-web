import React from 'react';
import { Carousel } from 'antd';

export default class Home extends React.Component {
    render() {
        return (
            <Carousel autoplay>
                <div>
                    <h3>Tortolla</h3>
                </div>
                <div>
                    <h3>2</h3>
                </div>
                <div>
                    <h3>3</h3>
                </div>
                <div>
                    <h3>4</h3>
                </div>
            </Carousel>
        )
    }
}