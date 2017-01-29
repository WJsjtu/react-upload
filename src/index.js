require('blueimp-file-upload/js/vendor/jquery.ui.widget.js');
require('blueimp-load-image/js/index.js');
require('blueimp-canvas-to-blob/js/canvas-to-blob.js');
require('blueimp-file-upload/js/jquery.iframe-transport.js');
require('blueimp-file-upload/js/jquery.fileupload.js');
require('blueimp-file-upload/js/jquery.fileupload-process.js');
require('blueimp-file-upload/js/jquery.fileupload-image.js');
require('blueimp-file-upload/js/jquery.fileupload-audio.js');
require('blueimp-file-upload/js/jquery.fileupload-video.js');
require('blueimp-file-upload/js/jquery.fileupload-validate.js');
require('blueimp-file-upload/js/cors/jquery.postmessage-transport.js');
require('blueimp-file-upload/js/cors/jquery.xdr-transport.js');


import React, {createElement} from 'react';
import {render} from 'react-dom';
import Root from './containers/Root';

render(
    <Root name='files' url='http://127.0.0.1/public/mp.php/upload/upload' options={{}} iconUrl='./../image/icons.png'/>,
    document.getElementById('root')
);