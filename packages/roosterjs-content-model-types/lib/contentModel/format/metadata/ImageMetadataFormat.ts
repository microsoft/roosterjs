/**
 * Metadata for inline image resize
 */
export type ImageResizeMetadataFormat = {
    /**
     * Width after resize, in px.
     * If image is cropped, this is the width of visible part
     * If image is rotated, this is the width before rotation
     * @default clientWidth of the image
     */
    widthPx?: number;

    /**
     * Height after resize, in px.
     * If image is cropped, this is the height of visible part
     * If image is rotated, this is the height before rotation
     * @default clientHeight of the image
     */
    heightPx?: number;
};

/**
 * Metadata for inline image crop
 */
export type ImageCropMetadataFormat = {
    /**
     * Left cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    leftPercent?: number;

    /**
     * Right cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    rightPercent?: number;

    /**
     * Top cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    topPercent?: number;

    /**
     * Bottom cropped percentage. Rotation or resizing won't impact this percentage value
     * @default 0
     */
    bottomPercent?: number;
};

/**
 * Metadata for inline image rotate
 */
export type ImageRotateMetadataFormat = {
    /**
     * Rotated angle of inline image, in radian. Cropping or resizing won't impact this percentage value
     * @default 0
     */
    angleRad?: number;
};

/**
 * Metadata for inline image
 */
export type ImageMetadataFormat = ImageResizeMetadataFormat &
    ImageCropMetadataFormat &
    ImageRotateMetadataFormat & {
        /**
         * Original src of the image. This value will not be changed when edit image. We can always use it
         * to get the original image so that all editing operation will be on top of the original image.
         */
        readonly src?: string;

        /**
         * Natural width of the original image (specified by the src field, may not be the current edited image)
         */
        readonly naturalWidth?: number;

        /**
         * Natural height of the original image (specified by the src field, may not be the current edited image)
         */
        readonly naturalHeight?: number;
    };
