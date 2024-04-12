import generateDataURL from './generateDataURL';
import getGeneratedImageSize from './generateImageSize';
import { ImageMetadataFormat } from 'roosterjs-content-model-types';
import { setMetadata } from './imageMetadata';

/**
 * @internal
 */
export function applyChanges(
    image: HTMLImageElement,
    editInfo: ImageMetadataFormat,
    initial: ImageMetadataFormat,
    clonedImaged?: HTMLImageElement
) {
    // Write back the change to image, and set its new size
    const generatedImageSize = getGeneratedImageSize(editInfo);
    if (generatedImageSize) {
        if (cropOrRotated(editInfo, initial)) {
            const newSrc = generateDataURL(clonedImaged ?? image, editInfo, generatedImageSize);
            if (newSrc) {
                image.src = newSrc;
            }
            setMetadata(image, editInfo);
        }

        const { targetWidth, targetHeight } = generatedImageSize;
        image.width = targetWidth;
        image.height = targetHeight;
        // Remove width/height style so that it won't affect the image size, since style width/height has higher priority
        image.style.removeProperty('width');
        image.style.removeProperty('height');
        image.style.removeProperty('max-width');
        image.style.removeProperty('max-height');
    }
}

function cropOrRotated(editInfo: ImageMetadataFormat, initial: ImageMetadataFormat) {
    if (editInfo.angleRad !== initial.angleRad) {
        return true;
    }
    const { leftPercent, rightPercent, topPercent, bottomPercent } = editInfo;
    if (
        leftPercent !== initial.leftPercent ||
        rightPercent !== initial.rightPercent ||
        topPercent !== initial.topPercent ||
        bottomPercent !== initial.bottomPercent
    ) {
        return true;
    }
    return false;
}
