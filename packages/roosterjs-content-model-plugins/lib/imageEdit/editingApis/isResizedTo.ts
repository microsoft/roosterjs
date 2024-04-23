import getTargetSizeByPercentage from '../utils/getTargetSizeByPercentage';
import { getImageEditInfo } from '../utils/getImageEditInfo';

/**
 * Check if the image is already resized to the given percentage
 * @param image The image to check
 * @param percentage The percentage to check
 * @param maxError Maximum difference of pixels to still be considered the same size
 */
export default function isResizedTo(
    image: HTMLImageElement,
    percentage: number,
    maxError: number = 1
): boolean {
    const editInfo = getImageEditInfo(image);
    //Image selection will sometimes return an image which is currently hidden and wrapped. Use HTML attributes as backup
    const visibleHeight = editInfo.heightPx || image.height;
    const visibleWidth = editInfo.widthPx || image.width;
    if (editInfo) {
        const { width, height } = getTargetSizeByPercentage(editInfo, percentage);
        return (
            Math.abs(width - visibleWidth) < maxError && Math.abs(height - visibleHeight) < maxError
        );
    }
    return false;
}
