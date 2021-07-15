/**
 * @internal The result structure for getGeneratedImageSize()
 */
export default interface GeneratedImageSize {
    /**
     * Final image width after rotate and crop
     */
    targetWidth: number;

    /**
     * Final image height after rotate and crop
     */
    targetHeight: number;

    /**
     * Original width of image before rotate and crop
     */
    originalWidth: number;

    /**
     * Original height of image before rotate and crop
     */
    originalHeight: number;

    /**
     * Visible width of image at current state
     * Depends on if beforeCrop is true passed into getGeneratedImageSize(),
     * the value can be before or after crop
     */
    visibleWidth: number;

    /**
     * Visible height of image at current state
     * Depends on if beforeCrop is true passed into getGeneratedImageSize(),
     * the value can be before or after crop
     */
    visibleHeight: number;
}
