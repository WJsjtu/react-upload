import styles from './../style.less';

export default function getModuleStyle(className) {
    return className.split(' ').map((cls) => {
        return styles[cls];
    }).join(' ');
}