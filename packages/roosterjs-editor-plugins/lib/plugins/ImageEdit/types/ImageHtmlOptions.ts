/**
 * @internal
 * Options for retrieve HTML string for image editing
 */
export default interface ImageHtmlOptions {
    /**
     * Border and handle color of resize and rotate handle
     */
    borderColor: string;

    /**
     * HTML string for rotate handle icon.
     * If not passed, a default SVG icon will be used
     */
    rotateIconHTML: string;

    /**
     * Background color of the rotate handle
     */
    rotateHandleBackColor: string;
}
