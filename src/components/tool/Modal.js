import {Component, PropTypes} from 'react';
import {unstable_renderSubtreeIntoContainer} from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class Modal extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.onMaskClick = ::this.onMaskClick;
        this.close = ::this.close;
        this.open = ::this.open;
        this.isOpen = ::this.isOpen;
        this.state = {
            isOpen: false
        };
    }

    set bodyOverFlowStyle(overflow) {
        this._bodyOverFlowStyle = overflow;
    }

    get bodyOverFlowStyle() {
        return this._bodyOverFlowStyle;
    }

    appendMaskIntoDoc() {

        const transform = 'translate(-50%, -50%)';

        if (this.state.isOpen) {
            const hidden = 'hidden';
            const bodyStyle = document.body.style;

            this.bodyOverFlowStyle = {
                overflow: bodyStyle.overflow,
                overflowX: bodyStyle.overflowX,
                overflowY: bodyStyle.overflowY
            };

            bodyStyle.overflow = hidden;
            bodyStyle.overflowX = hidden;
            bodyStyle.overflowY = hidden;
        }

        unstable_renderSubtreeIntoContainer(
            this,
            <div style={{display: this.state.isOpen ? 'block' : 'none'}}>
                <div style={{
                    zIndex: 999,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(55, 55, 55, 0.6)'
                }} onClick={this.onMaskClick}></div>
                {this.state.isOpen ? <div style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    WebkitTransform: transform,
                    OTransform: transform,
                    MsTransform: transform,
                    MozTransform: transform,
                    transform: transform,
                    width: 'auto',
                    backgroundClip: 'padding-box',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000
                }}> {this.props.children}
                </div> : undefined}
            </div>,
            this.container
        );
    }

    set container(container) {
        this._container = container;
    }

    get container() {
        return this._container;
    }

    onMaskClick(event) {
        event.stopPropagation();
        if (this.props.closeOnMaskClick) {
            this.close();
        }
    }

    close() {
        this.setState({
            isOpen: false
        });
        const bodyStyle = document.body.style;
        bodyStyle.overflow = this.bodyOverFlowStyle.overflow;
        bodyStyle.overflowX = this.bodyOverFlowStyle.overflowX;
        bodyStyle.overflowY = this.bodyOverFlowStyle.overflowY;
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    isOpen() {
        return this.state.isOpen;
    }

    componentDidMount() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.appendMaskIntoDoc();
    }

    componentDidUpdate() {
        this.appendMaskIntoDoc();
    }

    componentWillUnmount() {
        document.body.removeChild(this.container);
    }

    render() {
        return null;
    }
}

Modal.propTypes = process.env.NODE_ENV === "production" ? undefined : {
    closeOnMaskClick: PropTypes.bool
};

Modal.defaultProps = {
    closeOnMaskClick: true
};