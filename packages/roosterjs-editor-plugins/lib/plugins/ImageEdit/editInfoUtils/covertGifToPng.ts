import generateDataURL from './generateDataURL';
import ImageEditInfo from '../types/ImageEditInfo';

/**
 * @internal
 * If the image is a gif, use canvas to convert it to a png.
 * @param image to be converted
 * @returns
 */
export function convertGifToPng(editInfo: ImageEditInfo) {
    const { src, widthPx, heightPx, naturalHeight, naturalWidth } = editInfo;
    if (src.indexOf('.gif') > -1 || src.indexOf('image/gif') > -1) {
        const image = document.createElement('img');
        image.src = src;
        const newEditInfo = {
            src: src,
            widthPx: widthPx,
            heightPx: heightPx,
            naturalWidth: naturalWidth,
            naturalHeight: naturalHeight,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: 0,
        };

        return generateDataURL(image, newEditInfo);
    }
    return null;
}
