import GeneratedImageSize from '../types/GeneratedImageSize';
import { ImageMetadataFormat } from 'roosterjs-content-model/lib/publicTypes';

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
export default function getGeneratedImageSize(editInfo: ImageMetadataFormat): GeneratedImageSize {
    const {
        widthPx: width,
        heightPx: height,
        angleRad: angle,
        leftPercent: left,
        rightPercent: right,
        topPercent: top,
        bottomPercent: bottom,
    } = editInfo;

    const generateSize: GeneratedImageSize = {
        originalWidth: width || 0,
        originalHeight: height || 0,
        visibleWidth: width || 0,
        visibleHeight: height || 0,
        targetWidth: width || 0,
        targetHeight: height || 0,
    };

    // Original image size before crop and rotate

    if (width) {
        generateSize.originalWidth = width / (1 - (left || 0) - (right || 0));
    }

    if (height && top && bottom) {
        generateSize.originalHeight = height / (1 - (top || 0) - (bottom || 0));
    }

    if (width !== generateSize.originalWidth || height !== generateSize.originalHeight) {
        generateSize.visibleWidth = generateSize.originalWidth;
        generateSize.visibleHeight = generateSize.originalHeight;
    }

    if (generateSize.visibleHeight && generateSize.visibleWidth) {
        // Target size after crop and rotate
        generateSize.targetWidth =
            Math.abs(generateSize.visibleWidth * Math.cos(angle || 0)) +
            Math.abs(generateSize.visibleHeight * Math.sin(angle || 0));
        generateSize.targetHeight =
            Math.abs(generateSize.visibleWidth * Math.sin(angle || 0)) +
            Math.abs(generateSize.visibleHeight * Math.cos(angle || 0));
    }

    return generateSize;
}
