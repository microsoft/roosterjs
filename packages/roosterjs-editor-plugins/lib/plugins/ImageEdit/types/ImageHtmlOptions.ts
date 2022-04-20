import ImageEditInfo from './ImageEditInfo';

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
     * @deprecated
     * HTML string for rotate handle icon.
     * If not passed, a default SVG icon will be used
     */
    rotateIconHTML: string;

    /**
     * Background color of the rotate handle
     */
    rotateHandleBackColor: string;

    /**
     * Image editing data
     */
    editInfo: ImageEditInfo;

    /**
     * The number of handlers should be adapted to the image size
     * 8 handlers: 100x100px or bigger
     * 4 handlers: 50x50px or bigger
     * 1 handler: smaller than 50x50px
     */
    sizeAdaptiveHandles?: boolean;

    /**
     * The handlers should have circular borders
     */
    circularHandles?: boolean;
}
