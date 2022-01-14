/**
 * Options for ImageEdit plugin
 */
export default interface ImageEditOptions {
    /**
     * Color of resize/rotate border, handle and icon
     * @default #DB626C
     */
    borderColor?: string;

    /**
     * Minimum resize/crop width
     * @default 10
     */
    minWidth?: number;

    /**
     * Minimum resize/crop height
     * @default 10
     */
    minHeight?: number;

    /**
     * Whether preserve width/height ratio when resize
     * Pressing SHIFT key when resize will for preserve ratio even this value is set to false
     * @default false
     */
    preserveRatio?: boolean;

    /**
     * Minimum degree increase/decrease when rotate image.
     * Pressing SHIFT key when rotate will ignore this value and rotate by any degree with mouse moving
     * @default 5
     */
    minRotateDeg?: number;

    /**
     * Selector of the image that allows editing
     * @default img
     */
    imageSelector?: string;

    /**
     * @deprecated
     * HTML for the rotate icon
     * @default A predefined SVG icon
     */
    rotateIconHTML?: string;

    /**
     * A transformer function to help translate delta size from the size we got from mouse move
     * to a target size. By default it can be null since no transformation is needed.
     * This is mostly used when editor is put into a scaled container so that muse moved pixels
     * will not match the actual pixel changes
     */
    sizeTransformer?: (deltaX: number, deltaY: number) => { deltaX: number; deltaY: number };
}
