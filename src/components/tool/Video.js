import {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import isElement from './../../utils/isElement';
import Html from './Html';

export default class Video extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            width: this.props.width,
            height: this.props.height
        };
    }

    setVideoInfo() {
        if (typeof this.props.source == 'string') {
            if (this.refs.video) {
                this.refs.video.currentTime = this.props.currentTime || 0;
            }
        } else if (isElement(this.props.source)) {
            this.props.source.currentTime = this.props.currentTime || 0;
            this.props.source.style.width = this.state.width + 'px';
            this.props.source.style.height = this.state.height + 'px';
            this.props.source.controls = this.props.controls;
        }
    }

    componentDidMount() {
        this.setVideoInfo();
    }

    componentDidUpdate() {
        this.setVideoInfo();
    }

    render() {
        let video = undefined;
        if (this.props.source === 'string') {
            video = <video style={{width: this.state.width, height: this.state.height}}
                           src={this.props.source}
                           controls={this.props.controls}
            />;
        } else if (isElement(this.props.source)) {
            video = <Html element={this.props.source}
                          style={{width: this.state.width, height: this.state.height, display: 'inline-block'}}/>
        }

        return (
            <div style={{width: this.state.width, height: this.state.height, display: 'inline-block'}}>
                {video}
            </div>

        );
    }
}

Video.propTypes = process.env.NODE_ENV === "production" ? undefined : {
    source: PropTypes.oneOfType([
        PropTypes.string,
        function (props, propName, componentName) {
            if (!isElement(props[propName]) || props[propName].tagName.toLowerCase() !== 'video') {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Validation failed.'
                );
            }
        }
    ]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    controls: PropTypes.bool,
    currentTime: PropTypes.number
};

Video.defaultProps = {
    controls: true,
    currentTime: 0
};