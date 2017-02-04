import React, {Component, createElement} from 'react';
import {Provider} from 'react-redux';
import Uploader from './Uploader';
//<#IF_DEF DEBUG>
import DevTools from './DevTools';
//<#END_IF>

import configureStore from './../store/configureStore';

export default class Root extends Component {

    constructor(props) {
        super(props);
        this.store = configureStore();
    }

    render() {

        let root;

        //<#IF_DEF DEBUG>
        root = (
            <Provider store={this.store}>
                <div>
                    <Uploader {...this.props}/>
                    <DevTools />
                </div>
            </Provider>
        );
        //<#ELSE>
        root = (
            <Provider store={this.store}>
                <Uploader {...this.props}/>
            </Provider>
        );
        //<#END_IF>

        return root;
    }
}