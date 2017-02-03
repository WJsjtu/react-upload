import Resize, {getWindowSize} from './../components/tool/Resize';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {Component} from 'react';

export default function getResponsiveLayout(component, mapSizeToProps) {

    const wrappedComponentName = component.displayName
        || component.name
        || 'Component';

    class Responsive extends Component {

        constructor(props) {
            super(props);
            this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
            const {width, height} = getWindowSize();
            this.state = {
                transferProps: Object.assign({}, this.props, mapSizeToProps(width, height))
            };
            this.onResize = this.onResize.bind(this);
        }

        onResize(size) {
            const {width, height} = size;
            this.setState({
                transferProps: Object.assign({}, this.props, mapSizeToProps(width, height))
            });
        }

        render() {
            return (
                <Resize onResize={this.onResize}>
                    {React.createElement(component, this.state.transferProps)}
                </Resize>
            );
        }
    }

    Responsive.displayName = `Responsive(${wrappedComponentName})`;

    return Responsive;
}