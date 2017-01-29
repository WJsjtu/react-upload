import {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import isElement from './../../utils/isElement';

export default class Html extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    appendElement() {
        const element = this.props.element;
        if (element && isElement(element)) {
            this.refs.container.innerHTML = '';
            this.refs.container.appendChild(element);
        }
    }

    componentDidMount() {
        this.appendElement();
    }

    componentDidUpdate() {
        this.appendElement();
    }

    componentWillUnmount() {
        this.refs.container.innerHTML = '';
    }

    render() {
        return (<div style={this.props.style} ref='container'></div>);
    }
}

Html.propTypes = process.env.NODE_ENV === "production" ? undefined : {
    style: PropTypes.any,
    element: function (props, propName, componentName) {
        if (props[propName] && !isElement(props[propName])) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    }
};