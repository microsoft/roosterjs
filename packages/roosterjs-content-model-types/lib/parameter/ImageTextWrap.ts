/**
 * Specify how text should wrap around an image
 * - inline: The image is placed inline with text (display: inline). This is the default behavior
 * - square: Text wraps around the image (display: inline; float: left)
 * - topAndBottom: The image is placed in its own line, text is above and below it (display: block)
 */
export type ImageTextWrap = 'inline' | 'square' | 'topAndBottom';
