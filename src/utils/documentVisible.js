import dom from 'dom-helpers';

const hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
            null;
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

let visible = true;

const onVisibilityChange = function () {
    visible = !!document[hiddenProperty];
};

dom.on(document, visibilityChangeEvent, onVisibilityChange);

export default visible;