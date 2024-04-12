import { getMetadata } from './imageMetadata';
import { ImageMetadataFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getImageEditInfo(image: HTMLImageElement): ImageMetadataFormat {
    const imageEditInfo = getMetadata(image);
    return {
        src: image.getAttribute('src') || '',
        widthPx: image.clientWidth,
        heightPx: image.clientHeight,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        leftPercent: 0,
        rightPercent: 0,
        topPercent: 0,
        bottomPercent: 0,
        angleRad: 0,
        ...imageEditInfo,
    };
}
