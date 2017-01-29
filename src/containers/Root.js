import React, {Component, createElement} from 'react';
import {Provider} from 'react-redux';
import Uploader from './Uploader';
import DevTools from './DevTools';
import configureStore from './../store/configureStore';

export default class Root extends Component {

    constructor(props) {
        super(props);
        this.store = configureStore();
    }

    render() {
        return (
            <Provider store={this.store}>
                <div>
                    <Uploader {...this.props}/>
                    <DevTools />
                </div>
            </Provider>
        );
    }
}