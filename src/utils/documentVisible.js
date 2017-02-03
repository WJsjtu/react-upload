import {on as DOM_ON} from 'dom-helpers/events';

const hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
            null;
const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

let visible = true;

const onVisibilityChange = function () {
    visible = !!document[hiddenProperty];
};

DOM_ON(document, visibilityChangeEvent, onVisibilityChange);

export default visible;