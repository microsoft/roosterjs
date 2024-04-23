import { ImageMetadataFormat } from 'roosterjs-content-model-types/lib';

/**
 * @internal
 * Get target size of an image with a percentage
 * @param editInfo
 * @param percentage
 * @returns [width, height] array
 */
export default function getTargetSizeByPercentage(
    editInfo: ImageMetadataFormat,
    percentage: number
): { width: number; height: number } {
    const {
        naturalWidth,
        naturalHeight,
        leftPercent: left,
        topPercent: top,
        rightPercent: right,
        bottomPercent: bottom,
    } = editInfo;
    if (!naturalWidth || !naturalHeight) {
        return { width: 0, height: 0 };
    }
    const width = naturalWidth * (1 - (left || 0) - (right || 0)) * percentage;
    const height = naturalHeight * (1 - (top || 0) - (bottom || 0)) * percentage;
    return { width, height };
}
