export const IMAGE_EDIT_INFO_NAME = 'roosterEditInfo';

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
    width: number;

    /**
     * Height after resize, in px.
     * If image is cropped, this is the height of visible part
     * If image is rotated, this is the height before rotation
     * @default clientHeight of the image
     */
    height: number;
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
    left: number;

    /**
     * Right cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    right: number;

    /**
     * Top cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    top: number;

    /**
     * Bottom cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    bottom: number;
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
    angle: number;
}

/**
 * @internal
 * Edit info for inline image editing
 */
export default interface ImageEditInfo extends ResizeInfo, CropInfo, RotateInfo {
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
