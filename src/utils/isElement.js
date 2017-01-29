export default function isElement(element) {
    return typeof HTMLElement === 'object' ?
    element instanceof HTMLElement : (
        typeof Element === 'object' ? element instanceof Element :
        element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string'
    );

};