/**
 * @internal
 * Edit info for inline image resize
 */
export interface ResizeInfo {
    /**
     * Width after resize, in px.
     * If image is cropped, this is the width of visible part
     * If image is rotated, this is the width before rotation
     * @default clientWidth of the image
     */
    widthPx: number;

    /**
     * Height after resize, in px.
     * If image is cropped, this is the height of visible part
     * If image is rotated, this is the height before rotation
     * @default clientHeight of the image
     */
    heightPx: number;
}

/**
 * @internal
 * Edit info for inline image crop
 */
export interface CropInfo {
    /**
     * Left cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    leftPercent: number;

    /**
     * Right cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    rightPercent: number;

    /**
     * Top cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    topPercent: number;

    /**
     * Bottom cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    bottomPercent: number;
}

/**
 * @internal
 * Edit info for inline image rotate
 */
export interface RotateInfo {
    /**
     * Rotated angle of inline image, in radian. Cropping or resizing won't impact this percentage value
     * @default 0
     */
    angleRad: number;
}

/**
 * @internal
 * Flip info for inline image rotate
 */
export interface FlipInfo {
    /**
     * If true, the image was flipped.
     */
    flippedVertical?: boolean;
    /**
     * If true, the image was flipped.
     */
    flippedHorizontal?: boolean;
}

/**
 * @internal
 * Edit info for inline image editing
 */
export default interface ImageEditInfo extends ResizeInfo, CropInfo, RotateInfo, FlipInfo {
    /**
     * Original src of the image. This value will not be changed when edit image. We can always use it
     * to get the original image so that all editing operation will be on top of the original image.
     */
    readonly src: string;

    /**
     * Natural width of the original image (specified by the src field, may not be the current edited image)
     */
    readonly naturalWidth: number;

    /**
     * Natural height of the original image (specified by the src field, may not be the current edited image)
     */
    readonly naturalHeight: number;
}
