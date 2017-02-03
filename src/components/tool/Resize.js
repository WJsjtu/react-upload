import React, {PropTypes, Component, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {on as DOM_ON, off as DOM_OFF} from 'dom-helpers/events';

export default class Resize extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.updateSize = ::this.updateSize;
    }

    set mounted(_mounted) {
        this._mounted = _mounted;
    }

    get mounted() {
        return this._mounted;
    }

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