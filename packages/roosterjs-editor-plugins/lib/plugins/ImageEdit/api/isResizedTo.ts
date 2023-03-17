import getTargetSizeByPercentage from '../editInfoUtils/getTargetSizeByPercentage';
import { getEditInfoFromImage } from '../editInfoUtils/editInfo';

/**
 * Check if the image is already resized to the given percentage
 * @param image The image to check
 * @param percentage The percentage to check
 */
export default function isResizedTo(image: HTMLImageElement, percentage: number): boolean {
    const editInfo = getEditInfoFromImage(image);
    if (editInfo) {
        const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
        return (
            Math.round(width) == Math.round(editInfo.widthPx) &&
            Math.round(height) == Math.round(editInfo.heightPx)
        );
    }
    return false;
}
