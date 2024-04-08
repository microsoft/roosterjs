import { ImageMetadataFormat } from 'roosterjs-content-model-types';
import { setMetadata } from './imageMetadata';

export function applyChanges(
    image: HTMLImageElement,
    editInfo: ImageMetadataFormat,
    initial: ImageMetadataFormat
) {
    if (editInfo.widthPx !== initial.widthPx || editInfo.heightPx !== initial.heightPx) {
        image.style.width = `${editInfo.widthPx}px`;
        image.style.height = `${editInfo.heightPx}px`;
    }
    if (editInfo.angleRad !== initial.angleRad) {
        image.style.transform = `rotate(${editInfo.angleRad}rad)`;
    }

    setMetadata(image, editInfo);
}
