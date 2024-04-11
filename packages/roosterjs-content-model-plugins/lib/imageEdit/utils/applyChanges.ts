import generateDataURL from './generateDataURL';
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
    if (editInfo.widthPx !== initial.widthPx || editInfo.heightPx !== initial.heightPx) {
        image.style.width = `${editInfo.widthPx}px`;
        image.style.height = `${editInfo.heightPx}px`;
    }

    if (cropOrRotated(editInfo, initial)) {
        const newSrc = generateDataURL(clonedImaged ?? image, editInfo);
        if (newSrc) {
            image.src = newSrc;
        }
    }
    setMetadata(image, editInfo);
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
