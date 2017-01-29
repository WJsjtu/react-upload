import {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import isElement from './../../utils/isElement';
import Html from './Html';

const measureImageSize = (image) => {
    return new Promise((resolve, reject) => {

        let intervalHandler = null;

        const checkSize = () => {
            if (image.width > 0 && image.height > 0) {
                resolve(image.width, image.height);
                clearInterval(intervalHandler);
            }
        };

        intervalHandler = setInterval(checkSize, 50);

        image.onload = () => {
            clearInterval(intervalHandler);
            resolve(image.width, image.height);
        };

        image.onerror = () => {
            reject();
        };
    });
};

export default class Image extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            hidden: true
        };
    }

    setImageSize(props) {
        if (props.keepRatio) {

            const {originWidth, originHeight} = props;

            if (originWidth && originHeight) {

                const ratio = originWidth / originHeight;

                let width, height;

                if (originWidth / props.width > originHeight / props.height) {
                    width = props.width;
                    height = props.width / ratio;
                } else {
                    height = props.height;
                    width = props.height * ratio;
                }

                this.setState({width, height, hidden: false});

            } else {
                const image = new Image();
                if (typeof props.source === 'string') {
                    image.src = props.source;
                } else if (isElement(props.source)) {
                    image.src = props.source.src;
                }
                measureImageSize(image).then((width, height) => {
                    this.setState({width, height, hidden: false});
                });
            }
        } else {
            this.setState({
                hidden: false,
                width: props.width,
                height: props.height
            });
        }
    }

    getImageStyle(withUnit) {

        const unit = withUnit ? 'px' : 0;

        const style = {width: this.state.width + unit, height: this.state.height + unit, display: 'inline-block'};

        if (!this.props.clipBound) {
            style.marginTop = (this.props.height - this.state.height) / 2 + unit;
            style.marginLeft = (this.props.width - this.state.width) / 2 + unit;
        } else {
            style.marginTop = 0 + unit;
            style.marginLeft = 0 + unit;
        }

        return style;
    }

    componentDidMount() {
        this.setImageSize(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setImageSize(nextProps);
    }

    render() {


        let image = undefined;

        if (!this.state.hidden) {
            if (typeof this.props.source === 'string') {
                const imageStyle = this.getImageStyle();
                image = <img style={imageStyle} src={this.props.source}/>;
            } else if (isElement(this.props.source)) {
                const imageStyle = this.getImageStyle(true);
                Object.keys(imageStyle).forEach((key) => {
                    this.props.source.style[key] = imageStyle[key];
                });

                image = <Html element={this.props.source}/>;
            }
        }

        return (
            <div style={{
                display: 'inline-block',
                margin: 0,
                padding: 0,
                width: this.props.clipBound ? this.state.width : this.props.width,
                height: this.props.clipBound ? this.state.height : this.props.height
            }}>{image}</div>
        );
    }
}

Image.propTypes = process.env.NODE_ENV === "production" ? undefined : {
    source: PropTypes.oneOfType([
        PropTypes.string,
        function (props, propName, componentName) {
            if (!isElement(props[propName]) || props[propName].tagName.toLowerCase() !== 'img') {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. Validation failed.'
                );
            }
        }
    ]).isRequired,
    originWidth: PropTypes.number,
    originHeight: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    keepRatio: PropTypes.bool,
    clipBound: PropTypes.bool
};

Image.defaultProps = {
    keepRatio: true,
    clipBound: true
};