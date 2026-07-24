/**
 * @internal
 * CSS class names for image editing elements
 */
export enum ImageEditElementClass {
    /**
     * CSS class name for the image edit wrapper
     */
    Wrapper = 'r_wrapper',

    /**
     * CSS class name for the box that holds the image inside the wrapper
     */
    ImageBox = 'r_imageBox',

    /**
     * CSS class name for the selection border drawn around the image
     */
    Border = 'r_border',

    /**
     * State CSS class added to the wrapper to hide the editing decorations
     * (border and handles) while keeping the image visible
     */
    HideHandles = 'r_hideHandles',

    /**
     * CSS class name for resize handle
     */
    ResizeHandle = 'r_resizeH',

    /**
     * CSS class name for rotate handle
     */
    RotateHandle = 'r_rotateH',

    /**
     * CSS class name for the container of rotate handle
     */
    RotateCenter = 'r_rotateC',

    /**
     * CSS class name for crop overlay
     */
    CropOverlay = 'r_cropO',

    /**
     * CSS class name for container of crop handle
     */
    CropContainer = 'r_cropC',

    /**
     * CSS class name for crop handle
     */
    CropHandle = 'r_cropH',
}
