import React, {PropTypes, Component, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import dom from 'dom-helpers';
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
        dom.on(window, 'resize', this.updateSize);
        this.props.triggerOnMount && this.updateSize();
    }

    componentWillUnmount() {
        this.mounted = false;
        dom.off(window, 'resize', this.updateSize);
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
        height: window.screen.availHeight,
        width: window.screen.availWidth
    };
}