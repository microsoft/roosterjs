import getTargetSizeByPercentage from '../editInfoUtils/getTargetSizeByPercentage';
import { getEditInfoFromImage } from '../editInfoUtils/editInfo';

/**
 * Check if the image is already resized to the given percentage
 * @param image The image to check
 * @param percentage The percentage to check
 * @param maxError Maximum difference of pixels to still be considered the same size
 */
export default function isResizedTo(
    image: HTMLImageElement,
    percentage: number,
    maxError = 1
): boolean {
    const editInfo = getEditInfoFromImage(image);
    if (editInfo) {
        const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
        return (
            Math.abs(width - editInfo.widthPx) < maxError &&
            Math.abs(height - editInfo.heightPx) < maxError
        );
    }
    return false;
}
