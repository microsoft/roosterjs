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
     * Background color of the rotate handle
     */
    rotateHandleBackColor: string;

    /**
     * Verify if the area of the image is less than 10000px, if yes, don't insert the side handles
     */
    isSmallImage: boolean;
}
