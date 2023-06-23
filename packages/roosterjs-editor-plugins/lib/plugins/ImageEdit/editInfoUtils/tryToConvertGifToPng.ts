import generateDataURL from './generateDataURL';
import ImageEditInfo from '../types/ImageEditInfo';

/**
 * @internal
 * Check if the image is a gif, if true, use canvas to convert it to a png.
 * If the image is not a gif, return null.
 * @param image to be converted
 * @returns the converted image data url or null, if the image is not a gif
 */
export function tryToConvertGifToPng(editInfo: ImageEditInfo) {
    const { src, widthPx, heightPx, naturalHeight, naturalWidth } = editInfo;
    if (src.indexOf('.gif') > -1 || src.indexOf('image/gif') > -1) {
        try {
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
        } catch {
            return null;
        }
    }
    return null;
}
