import React, {PropTypes, Component, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
/**
 * Well, Tree-Shaking doesn't work even if written in this way, the whole dom-helpers is bundled.
 */
import {on as DOM_ON, off as DOM_OFF} from 'dom-helpers/events';

/**
 * However this doesn't work either. I give up.
 */
/*
 import DOM_ON from 'dom-helpers/events/on';
 import DOM_OFF from 'dom-helpers/events/off';
 */

import {autobind} from 'core-decorators';

export default class Resize extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    set mounted(_mounted) {
        this._mounted = _mounted;
    }

    get mounted() {
        return this._mounted;
    }

    @autobind
    updateSize() {
        this.mounted && this.props.onResize(getWindowSize());
    }

    componentDidMount() {
        this.mounted = true;
        DOM_ON(window, 'resize', this.updateSize);
        this.props.triggerOnMount && this.updateSize();
    }

    componentWillUnmount() {
        this.mounted = false;
        DOM_OFF(window, 'resize', this.updateSize);
    }

    render() {
        return this.props.children;
    }
}

Resize.propTypes = {
    children: PropTypes.element.isRequired,
    onResize: PropTypes.func,
    triggerOnMount: PropTypes.bool
};

Resize.defaultProps = {
    onResize: () => {
    },
    triggerOnMount: false
};

export function getWindowSize() {
    return {
        height: window.innerHeight,
        width: window.innerWidth
    };
}