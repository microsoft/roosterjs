/**
 * Operation flags for ImageEdit plugin
 */
export enum ImageEditOperation {
    /**
     * No operation
     */
    None = 0,

    /**
     * Resize image from corner ( horizontal and vertical resize)
     */
    CornerResize = 1,

    /**
     * Resize image from side ( either horizontal or vertical resize)
     */
    SideResize = 2,

    /**
     * Image resize
     */
    Resize = CornerResize | SideResize,

    /**
     * Image rotate
     */
    Rotate = 4,

    /**
     * Image resize and rotate
     */
    ResizeAndRotate = Resize | Rotate,

    /**
     * Image crop
     */
    Crop = 8,

    /**
     * All operations
     */
    All = ResizeAndRotate | Crop,
}
