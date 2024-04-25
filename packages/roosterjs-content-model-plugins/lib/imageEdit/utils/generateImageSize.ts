import type { ImageMetadataFormat } from 'roosterjs-content-model-types';
import type { GeneratedImageSize } from '../types/GeneratedImageSize';

/**
 * @internal
 * Calculate the target size of an image.
 * For image that is not rotated, target size is the same with resizing/cropping size.
 * For image that is rotated, target size is calculated from resizing/cropping size and its rotate angle
 * Say an image is resized to 100w*100h, cropped 25% on each side, then rotated 45deg, so that cropped size
 * will be (both height and width) 100*(1-0.25-0,25) = 50px, then final image size will be 50*sqrt(2) = 71px
 * @param editInfo The edit info to calculate size from
 * @param beforeCrop True to calculate the full size of original image before crop, false to calculate the size
 * after crop
 * @returns A GeneratedImageSize object which contains original, visible and target target width and height of the image
 */
export default function getGeneratedImageSize(
    editInfo: ImageMetadataFormat,
    beforeCrop?: boolean
): GeneratedImageSize | undefined {
    const {
        widthPx: width,
        heightPx: height,
        angleRad,
        leftPercent: left,
        rightPercent: right,
        topPercent: top,
        bottomPercent: bottom,
    } = editInfo;

    if (
        height == undefined ||
        width == undefined ||
        left == undefined ||
        right == undefined ||
        top == undefined ||
        bottom == undefined
    ) {
        return;
    }

    const angle = angleRad ?? 0;

    // Original image size before crop and rotate
    const originalWidth = width / (1 - left - right);
    const originalHeight = height / (1 - top - bottom);

    // Visible size
    const visibleWidth = beforeCrop ? originalWidth : width;
    const visibleHeight = beforeCrop ? originalHeight : height;

    // Target size after crop and rotate
    const targetWidth =
        Math.abs(visibleWidth * Math.cos(angle)) + Math.abs(visibleHeight * Math.sin(angle));
    const targetHeight =
        Math.abs(visibleWidth * Math.sin(angle)) + Math.abs(visibleHeight * Math.cos(angle));

    return {
        targetWidth,
        targetHeight,
        originalWidth,
        originalHeight,
        visibleWidth,
        visibleHeight,
    };
}
