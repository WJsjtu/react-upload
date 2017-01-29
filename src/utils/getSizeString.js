const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default function getSizeString(size) {

    size = +size;

    if (size == 0) return '0 B';
    if (isNaN(size)) return '';

    const scale = Math.floor(Math.log(size) / Math.log(1024));

    if (scale > 0 && scale < sizeUnits.length) {
        return `${'' + (size / Math.pow(1024, scale)).toFixed(2)} ${sizeUnits[scale]}`;
    } else {
        return `${'' + (size / Math.pow(1024, sizeUnits.length - 1)).toFixed(2)} ${sizeUnits[sizeUnits.length - 1]}`;
    }
}