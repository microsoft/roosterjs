import type { ImageEditOperation } from 'roosterjs-content-model-types';

/**
 * Options for customize ImageEdit plugin
 */
export interface ImageEditOptions {
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
     * Whether side resizing (single direction resizing) is disabled. @default false
     */
    disableSideResize?: boolean;

    /**
     * Whether image rotate is disabled. @default false
     */
    disableRotate?: boolean;

    /**
     * Whether image crop is disabled. @default false
     */
    disableCrop?: boolean;

    /**
     * Which operations will be executed when image is selected
     * @default resizeAndRotate
     */
    onSelectState?: ImageEditOperation[];
}
