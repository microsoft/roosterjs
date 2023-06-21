import getGeneratedImageSize from './getGeneratedImageSize';
import ImageEditInfo from '../types/ImageEditInfo';

/**
 * @internal
 * Generate new dataURL from an image and edit info
 * @param image The image to generate data URL from. It is supposed to have original src loaded
 * @param editInfo Edit info of the image
 * @returns A BASE64 encoded string with image prefix that represents the content of the generated image.
 * If there are rotate/crop/resize info in the edit info, the generated image will also reflect the result.
 * It is possible to throw exception since the original image may not be able to read its content from
 * the code, so better check canRegenerateImage() of the image first.
 * @throws Exception when fail to generate dataURL from canvas
 */
export default function generateDataURL(image: HTMLImageElement, editInfo: ImageEditInfo): string {
    const {
        angleRad: angle,
        widthPx: width,
        heightPx: height,
        bottomPercent: bottom,
        leftPercent: left,
        rightPercent: right,
        topPercent: top,
        naturalWidth,
        naturalHeight,
    } = editInfo;
    const imageWidth = naturalWidth * (1 - left - right);
    const imageHeight = naturalHeight * (1 - top - bottom);
    const canvas = document.createElement('canvas');
    const { targetWidth, targetHeight } = getGeneratedImageSize(editInfo);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.translate(targetWidth / 2, targetHeight / 2);
        context.rotate(angle);
        context.scale(editInfo.flippedHorizontal ? -1 : 1, editInfo.flippedVertical ? -1 : 1);
        context.drawImage(
            image,
            naturalWidth * left,
            naturalHeight * top,
            imageWidth,
            imageHeight,
            -width / 2,
            -height / 2,
            width,
            height
        );
    }

    return canvas.toDataURL('image/png', 1.0);
}
