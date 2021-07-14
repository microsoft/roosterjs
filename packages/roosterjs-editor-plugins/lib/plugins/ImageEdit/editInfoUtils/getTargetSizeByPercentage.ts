import ImageEditInfo from '../types/ImageEditInfo';

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
): number[] {
    const { naturalWidth, naturalHeight, left, top, right, bottom } = editInfo;
    const width = naturalWidth * (1 - left - right) * percentage;
    const height = naturalHeight * (1 - top - bottom) * percentage;
    return [width, height];
}
