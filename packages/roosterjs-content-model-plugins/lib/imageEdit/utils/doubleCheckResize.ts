import { ImageMetadataFormat } from 'roosterjs-content-model-types/lib';

/**
 * @internal
 * Double check if the changed size can satisfy current width of container.
 * When resize an image and preserve ratio, its size can be limited by the size of container.
 * So we need to check the actual size and calculate the size again
 * @param editInfo Edit info of the image
 * @param preserveRatio Whether w/h ratio need to be preserved
 * @param actualWidth Actual width of the image after resize
 * @param actualHeight Actual height of the image after resize
 */
export function doubleCheckResize(
    editInfo: ImageMetadataFormat,
    preserveRatio: boolean,
    actualWidth: number,
    actualHeight: number
) {
    let { widthPx, heightPx } = editInfo;
    if (widthPx == undefined || heightPx == undefined) {
        return;
    }
    const ratio = heightPx > 0 ? widthPx / heightPx : 0;

    actualWidth = Math.floor(actualWidth);
    actualHeight = Math.floor(actualHeight);
    widthPx = Math.floor(widthPx);
    heightPx = Math.floor(heightPx);

    editInfo.widthPx = actualWidth;
    editInfo.heightPx = actualHeight;

    if (preserveRatio && ratio > 0 && (widthPx !== actualWidth || heightPx !== actualHeight)) {
        if (actualWidth < widthPx) {
            editInfo.heightPx = actualWidth / ratio;
        } else {
            editInfo.widthPx = actualHeight * ratio;
        }
    }
}
