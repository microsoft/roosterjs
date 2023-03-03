import getGeneratedImageSize from './getGeneratedImageSize';
import { ImageMetadataFormat } from 'roosterjs-content-model/lib/publicTypes';

export default function generateRotateImageURL(
    image: HTMLImageElement,
    editInfo: ImageMetadataFormat
): string {
    const { targetHeight, targetWidth, originalHeight, originalWidth } = getGeneratedImageSize(
        editInfo
    );
    const { angleRad, naturalHeight, naturalWidth, leftPercent, topPercent } = editInfo;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.translate(targetWidth / 2, targetHeight / 2);
        context.rotate(angleRad || 0);
        context.drawImage(
            image,
            (naturalWidth || image.naturalWidth) * (leftPercent || 0),
            (naturalHeight || image.naturalHeight) * (topPercent || 0),
            originalWidth,
            originalHeight,
            -targetWidth / 2,
            -targetHeight / 2,
            targetWidth,
            targetHeight
        );
    }
    return canvas.toDataURL();
}
