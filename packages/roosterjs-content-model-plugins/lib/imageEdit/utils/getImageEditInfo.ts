import { getMetadata } from './imageMetadata';
import { ImageMetadataFormat } from 'roosterjs-content-model-types';

export function getImageEditInfo(image: HTMLImageElement): ImageMetadataFormat {
    const imageEditInfo = getMetadata(image);
    return (
        imageEditInfo ?? {
            src: image.getAttribute('src') || '',
            widthPx: image.clientWidth,
            heightPx: image.clientHeight,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0,
            bottomPercent: 0,
            angleRad: parseInt(image.style.rotate) || 0,
        }
    );
}
