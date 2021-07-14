import ImageEditInfo from '../types/ImageEditInfo';

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
 * @returns an array contains width and height of the size in the sequence of:
 *  rotatedWidth, rotatedHeight: The actual size the the image will occupy after rotate
 *  fullWidth, fullHeight: Full size of the image before crop, before rotate
 *  visibleWidth, visibleHeight: Visible size after crop before rotate
 */
export default function getGeneratedImageSize(
    editInfo: ImageEditInfo,
    beforeCrop?: boolean
): number[] {
    const { width, height, angle, left, right, top, bottom } = editInfo;

    // Full
    const fullWidth = width / (1 - left - right);
    const fullHeight = height / (1 - top - bottom);
    const visibleWidth = beforeCrop ? fullWidth : width;
    const visibleHeight = beforeCrop ? fullHeight : height;
    const targetWidth =
        Math.abs(visibleWidth * Math.cos(angle)) + Math.abs(visibleHeight * Math.sin(angle));
    const targetHeight =
        Math.abs(visibleWidth * Math.sin(angle)) + Math.abs(visibleHeight * Math.cos(angle));

    return [targetWidth, targetHeight, fullWidth, fullHeight, visibleWidth, visibleHeight];
}
