import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import 'normalize.css';
import SiteLayout from './Layout';

document.addEventListener('DOMContentLoaded', function () {

    ReactDOM.render(
        <SiteLayout/>
        ,
        document.getElementById('root')

    );

});
