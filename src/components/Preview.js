import {Component, PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Html from './tool/Html';
import Modal from './tool/Modal';
import Image from './tool/Image';
import Video from './tool/Video';

import getResponsiveLayout from './../utils/getResponsiveLayout';
import getFileIcon from './../utils/getFileIcon';

import isElement from './../utils/isElement';

const rangeZoom = 0.8;

const loadImage = require('load-image');

/**
 *
 * @param {File|Blob} rawFile
 * @return {Promise}
 */
const loadImageByFile = (rawFile) => {
    return new Promise(function (resolve, reject) {
        const result = loadImage(rawFile, (img) => {
                if (img.type === 'error') {
                    reject();
                } else {
                    const imageHeight = img.height, imageWidth = img.width;
                    if (imageHeight && imageWidth) {
                        resolve(img);
                    } else {
                        reject();
                    }
                }
            }
        );
        if (!result) {
            reject();
        }
    });
};

/**
 *
 * @param {HTMLElement} oldCanvas
 * @return {Promise}
 */
const cloneCanvas = (oldCanvas) => {

    return new Promise((resolve, reject) => {
        try {
            //create a new canvas
            var newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            //set dimensions
            newCanvas.width = oldCanvas.width;
            newCanvas.height = oldCanvas.height;

            //apply the old canvas to the new one
            context.drawImage(oldCanvas, 0, 0);

            //return the new canvas
            resolve(newCanvas);
        } catch (e) {
            reject();
        }
    });
};


export default class Preview extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.onClick = ::this.onClick;
        this.preview = null;
        this.source = null;
        this.state = {
            preview: null,
            source: null
        }
    }

    /**
     *
     * @param {React.Element|null} preview
     */
    set preview(preview) {
        this._preview = preview;
    }

    /**
     *
     * @return {React.Element|null}
     */
    get preview() {
        return this._preview;
    }

    /**
     *
     * @param {React.Element|null} source
     */
    set source(source) {
        this._source = source;
    }

    /**
     *
     * @return {React.Element|null}
     */
    get source() {
        return this._preview;
    }

    /**
     *
     * @param {HTMLElement} preview
     * @param {number} targetWidth
     * @param {number} targetHeight
     * @return {React.Element}
     */
    getPreview(preview, targetWidth, targetHeight) {

        this.preview = preview;

        const tagName = (preview.tagName || preview.nodeName || '').toLowerCase();

        if (tagName == 'canvas') {

            const canvasWidth = preview.width, canvasHeight = preview.height;
            preview.style.marginTop = (targetHeight - canvasHeight) / 2 + 'px';
            preview.style.marginLeft = (targetWidth - canvasWidth) / 2 + 'px';
            return <Html element={preview}/>;

        } else if (tagName == 'img') {
            return <Image source={preview} width={targetWidth} height={targetHeight} keepRatio={true}
                          originHeight={preview.height} originWidth={preview.width}
            />;

        } else if (tagName == 'video') {
            return <Video source={preview} controls={false} width={targetWidth} height={targetHeight}
                          currentTime={10}/>;
        } else {
            return <Html style={{width: targetWidth, height: targetHeight, overflow: 'auto'}} element={preview}/>;
        }
    }

    /**
     *
     * @param {HTMLElement} source
     * @return {React.Element}
     */
    getSource(source) {

        this.source = source;

        const tagName = (source.tagName || source.nodeName || '').toLowerCase();

        if (tagName == 'img') {

            const imageWidth = source.width, imageHeight = source.height;

            const RImage = getResponsiveLayout(Image, (width, height) => {
                return {
                    width: Math.min(imageWidth, width * rangeZoom),
                    height: Math.min(imageHeight, height * rangeZoom)
                }
            });

            return <RImage source={source} keepRatio={true} originHeight={source.height} originWidth={source.width}/>;

        } else if (tagName == 'video') {

            const RVideo = getResponsiveLayout(Video, (width, height) => {
                const maxWidth = source.videoWidth ? Math.min(rangeZoom * width, source.videoWidth) : rangeZoom * width;
                const maxHeight = source.videoHeight ? Math.min(rangeZoom * height, source.videoHeight) : rangeZoom * height;

                /**
                 * Keep ratio here
                 */
                if (source.videoHeight && source.videoWidth) {
                    if (maxWidth / source.videoWidth > maxHeight / source.videoHeight) {
                        return {
                            width: maxHeight * source.videoWidth / source.videoHeight,
                            height: maxHeight
                        }
                    } else {
                        return {
                            width: maxWidth,
                            height: maxWidth * source.videoHeight / source.videoWidth
                        }
                    }
                } else {
                    return {
                        width: maxWidth,
                        height: maxHeight,
                    }
                }
            });


            return <RVideo source={source} controls={true} currentTime={0}/>;
        } else if (tagName == 'audio') {

            const RHtml = getResponsiveLayout(Html, (width, height) => {
                return {
                    style: {
                        width: width * rangeZoom
                    }
                }
            });
            source.style.width = '100%';

            return <RHtml style={{overflow: 'auto'}} element={source}/>;
        } else {

            const RHtml = getResponsiveLayout(Html, (width, height) => {
                return {
                    width: width * rangeZoom,
                    height: height * rangeZoom
                }
            });

            return <RHtml style={{overflow: 'auto'}} element={source}/>;
        }
    }

    /**
     *
     * @param {HTMLElement} preview
     * @param {File} file
     * @param {number} targetWidth
     * @param {number} targetHeight
     */
    previewCanvas(preview, file, targetWidth, targetHeight) {

        if (preview && file) {
            const previewCopy = (rawPreview, rawFile, forceLoad) => new Promise((resolve, reject) => {
                if (!forceLoad) {
                    cloneCanvas(rawPreview).then((newCanvas) => {
                        resolve(newCanvas);
                    }, () => {
                        loadImageByFile(rawFile).then((newImage) => {
                            resolve(newImage);
                        }, () => {
                            reject();
                        });
                    })
                } else {
                    loadImageByFile(rawFile).then((newImage) => {
                        resolve(newImage);
                    }, () => {
                        reject();
                    });
                }
            });

            Promise.all([
                previewCopy(preview, file),
                previewCopy(preview, file, true)
            ]).then((images) => {
                this.setState({
                    preview: this.getPreview(images[0], targetWidth, targetHeight),
                    source: this.getSource(images[1])
                });
            });
        } else if (this.preview) {
            this.setState({
                preview: this.getPreview(this.preview, targetWidth, targetHeight)
            });
        } else {
            this.setState({
                preview: null,
                source: null
            });
        }
    }

    /**
     *
     * @param {HTMLElement} preview
     * @param {File} file
     * @param {number} targetWidth
     * @param {number} targetHeight
     */
    previewImage(preview, file, targetWidth, targetHeight) {
        if (preview && file) {
            Promise.all([
                loadImageByFile(file),
                loadImageByFile(file)
            ]).then((images) => {
                this.setState({
                    preview: this.getPreview(images[0], targetWidth, targetHeight),
                    source: this.getSource(images[1])
                });
            });
        } else if (this.preview) {
            this.setState({
                preview: this.getPreview(this.preview, targetWidth, targetHeight)
            });
        } else {
            this.setState({
                preview: null,
                source: null
            });
        }
    }

    /**
     *
     * @param {HTMLElement} preview
     * @param {File} file
     * @param {number} targetWidth
     * @param {number} targetHeight
     */
    previewOther(preview, file, targetWidth, targetHeight) {

        if (preview && file) {
            this.setState({
                preview: this.getPreview(preview.cloneNode(true), targetWidth, targetHeight),
                source: this.getSource(preview.cloneNode(true))
            });
        } else if (this.preview) {
            this.setState({
                preview: this.getPreview(this.preview, targetWidth, targetHeight)
            });
        } else {
            this.setState({
                preview: null,
                source: null
            });
        }
    }

    /**
     *
     * @param {HTMLElement} preview
     * @param {File} file
     * @param {number} targetWidth
     * @param {number} targetHeight
     */
    getStateFromPreview(preview, file, targetWidth, targetHeight) {
        if (!isElement(preview)) {
            if (file && file.name) {
                this.preview = null;
                this.source = null;
                this.setState({
                    preview: getFileIcon(file.name, this.props.iconUrl, targetWidth, targetHeight),
                    source: null
                });
            }
            return;
        }

        const tagName = (preview.tagName || preview.nodeName || '').toLowerCase();

        switch (tagName) {
            case 'canvas':
                return this.previewCanvas(preview, file, targetWidth, targetHeight);
            case 'img':
                return this.previewImage(preview, file, targetWidth, targetHeight);
            case 'video':
            case 'audio':
            default:
                return this.previewOther(preview, file, targetWidth, targetHeight);
        }
    }

    componentWillReceiveProps(nextProps) {
        const needUpdateAll = nextProps.file !== this.props.file || nextProps.previewed !== this.props.previewed;

        if (this.props.width !== nextProps.width || this.props.height !== nextProps.height || needUpdateAll) {
            if (needUpdateAll) {
                this.getStateFromPreview(
                    nextProps.file.preview,
                    nextProps.file,
                    nextProps.width,
                    nextProps.height
                );
            } else {
                this.getStateFromPreview(
                    undefined,
                    undefined,
                    nextProps.width,
                    nextProps.height
                );
            }
        }
    }

    componentDidMount() {
        this.getStateFromPreview(
            this.props.file.preview,
            this.props.file,
            this.props.width,
            this.props.height
        );
    }

    onClick(event) {
        event.stopPropagation();
        if (this.refs.modal && !this.refs.modal.isOpen() && this.state.source) {
            this.refs.modal.open();
        }
    }

    render() {
        const style = {
            width: this.props.width,
            height: this.props.height,
            cursor: this.state.source ? 'pointer' : 'default'
        };

        const fontSize = Math.min(this.props.width, this.props.height) / 8;

        return this.state.preview ? (
            <div style={style} onClick={this.onClick}>
                {this.state.preview}
                <Modal ref='modal'>
                    {this.state.source}
                </Modal>
            </div>
        ) : (
            <div style={style} onClick={this.onClick}>
                <div style={{
                    textAlign: 'center',
                    fontSize: fontSize,
                    lineHeight: this.props.height + 'px'
                }}>
                    <i className='fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom'> </i>
                </div>
            </div>
        );
    }
}

Preview.propTypes = {
    file: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.instanceOf(Blob)
    ]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    previewed: PropTypes.bool.isRequired,
    iconUrl: PropTypes.string.isRequired
};