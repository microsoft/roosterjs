import ImageEditInfo from '../types/ImageEditInfo';
import ImageSize from '../types/ImageSize';

/**
 * @internal
 * Get target size of an image with a percentage
 * @param editInfo
 * @param percentage
 * @returns [width, height] array
 */
export default function getTargetSizeByPercentage(
    editInfo: ImageEditInfo,
    percentage: number
): ImageSize {
    const {
        naturalWidth,
        naturalHeight,
        leftPercent: left,
        topPercent: top,
        rightPercent: right,
        bottomPercent: bottom,
    } = editInfo;
    const width = naturalWidth * (1 - left - right) * percentage;
    const height = naturalHeight * (1 - top - bottom) * percentage;
    return { width, height };
}
