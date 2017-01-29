import {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import jQuery from 'jquery';
import uid from './../utils/uid';
import cid from './../constants/ComponentNonce';

import styles from './../style.less';

const EVENT_NAMESPACE = 'fileupload';

/**
 * @param {string} url
 * @param {number} chunkSize
 * @param {object} options
 * @return {object}
 */
const getOptions = (url, chunkSize = 2 * 1024 * 1024, options) => {
    const defaultOptions = {
        dataType: 'json',
        disableImagePreview: false,
        disableAudioPreview: false,
        disableVideoPreview: false,
        maxFileSize: 0
    };
    const requiredOptions = {
        disableImageResize: true,
        autoUpload: false
    };

    return Object.assign(defaultOptions, options, requiredOptions, {
        url: url,
        maxChunkSize: chunkSize
    });
};


export default class Input extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    /**
     *
     * @return {jQuery}
     */
    get jQueryFileUpload() {
        return this._jQueryFileUpload;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.options !== this.props.options ||
            nextProps.url !== this.props.url ||
            nextProps.chunkSize !== this.props.chunkSize
        ) {
            this.jQueryFileUpload.fileupload('option', getOptions(
                nextProps.url,
                nextProps.chunkSize,
                nextProps.options
            ));
        }
    }

    componentDidMount() {
        this._jQueryFileUpload = jQuery(this.refs.fileInput).fileupload(getOptions(
            this.props.url,
            this.props.chunkSize,
            this.props.options
        ));

        const {actions} = this.props;

        this.jQueryFileUpload.on(EVENT_NAMESPACE + 'add', (e, data) => {
            const fid = uid();
            data.id = fid;
            data.formData = this.props.formData(data, fid, cid);
            actions.addFile(data, fid);
        }).on(EVENT_NAMESPACE + 'processalways', (e, data) => {

            if (!data.id) return;

            const file = data.files[+data.index];

            if (file.preview) {
                actions.processFile(data.id);
            } else {
                actions.processFile(data.id);
            }

            if (file.error) {
                actions.errorFile(data.id, file.error);
            }
        }).on(EVENT_NAMESPACE + 'progress', function (e, data) {
            if (!data.id) return;
            actions.updateFileLoaded(data.id, data.loaded);
            data.total && actions.updateFileSize(data.id, data.total);
        });
    }

    componentWillUnmount() {
        this.jQueryFileUpload.fileupload('destroy');
    }

    render() {
        return (
            <div className={styles.uploader}>
                <div>
                    <span className={styles.inputButton}>
                        <i className='fa fa-plus' title='添加文件'> </i>
                        <span>&nbsp;添加文件</span>
                        <input className={styles.input} type='file' name={`${this.props.name}[]`} multiple
                               ref='fileInput'/>
                    </span>
                </div>
            </div>
        );
    }
}