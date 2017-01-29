import React, {PropTypes, Component, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import styles from './../style.less';

export default class ProgressBar extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {

        const total = parseFloat(this.props.total);
        const loaded = parseFloat(this.props.loaded);

        const percent = isNaN(total) || isNaN(loaded) ? undefined : 100 * loaded / total;

        const height = this.props.height;

        return (
            <div className={styles.progress} style={{height: height}}>
                <div className={styles.progressBar} style={{
                    width: percent + '%'
                }}></div>
                <span style={{
                    lineHeight: height + 'px',
                    fontSize: height * 0.8,
                    color: (typeof percent == 'undefined' || percent < 50) ? '#000000' : '#ffffff',
                    WebkitTransform: `scale(${height * 0.8 < 12 ? 0.8 : 1.0})`
                }}>{typeof percent != 'undefined' ? percent.toFixed(2) + '%' : '- -'}</span>
            </div>
        );
    }
}

ProgressBar.propTypes = {
    loaded: PropTypes.number,
    total: PropTypes.number,
    height: PropTypes.number.isRequired
};