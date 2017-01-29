import React, {Component, createElement} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as TaskActions from '../actions/TaskActions';

import Input from './../components/Input';
import Task from './../components/Task';


import styles from './../style.less';


@connect(mapState, mapDispatch)
class Uploader extends Component {

    render() {
        let {tasks, actions, options} = this.props;

        options = Object.assign(options, {
            previewMaxWidth: 108,
            previewMaxHeight: 72
        });

        return (
            <div>
                <Input options={options}
                       url={this.props.url}
                       chunkSize={2 * 1024 * 1024}
                       actions={actions}
                       formData={(data, fileId, componentId) => {
                           return {
                               fileId: fileId,
                               componentId: componentId
                           };
                       }}
                       name={this.props.name}
                />
                <div className={styles.taskBody}>
                    {tasks.map(task => Task.call(this, task, actions, options))}
                </div>
            </div>
        );
    }
}

function mapState(state) {
    window.state = state;
    return {
        tasks: state.tasks
    };
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(TaskActions, dispatch)
    };
}

export default Uploader;