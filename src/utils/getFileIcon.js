const iconArray = [
    {reg: /\.docx?$/i, type: 1},
    {reg: /\.pptx?$/i, type: 2},
    {reg: /\.xlsx?$/i, type: 3},
    {reg: /\.(bmp|jpe?g|tiff|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|png)$/i, type: 4},
    {reg: /\.(mp4|mkv|rmvb|rm|flv|avi|mpe?g|3gp|wmv|f4v|mov|swf|vob)$/i, type: 5},
    {reg: /\.(mp3|wav|ape|aac|wma)$/i, type: 6},
    {reg: /\.pdf$/i, type: 7},
    {reg: /\.(txt|md|rtf|tex|wps|csv)$/i, type: 8},
    {reg: /\.(zip|rar|7z|tar)$/i, type: 9},
    {reg: /\.([a-z0-9\$\u4e00-\u9fa5][a-z0-9\$_\u4e00-\u9fa5\s]*)$/i, type: 0}
];

/**
 *
 * @param {string} fileName
 * @param {string} url
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @param {number} scale
 */
export default function getFileIcon(fileName, url, targetWidth, targetHeight, scale = 0.8) {

    const getIconStyle = (url, index, targetWidth, targetHeight) => {
        const size = Math.min(targetWidth, targetHeight) * scale;
        return (
            <div style={{width: targetWidth, height: targetHeight}}>
                <div style={{
                    width: size,
                    height: size,
                    overflow: 'hidden',
                    marginLeft: (targetWidth - size) / 2,
                    marginTop: (targetHeight - size) / 2
                }}>
                    <img src={url}
                         style={{border: "none", width: size * 10, height: size, marginLeft: -index * size}}/>
                </div>
            </div>
        );
    };


    for (let i = 0, l = iconArray.length; i < l; i++) {
        if (fileName.match(iconArray[i].reg)) {
            return getIconStyle(url, iconArray[i].type, targetWidth, targetHeight);
        }
    }

    return getIconStyle(url, iconArray[iconArray.length - 1].type, targetWidth, targetHeight);
};