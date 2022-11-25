import ModeIndependentColor from './ModeIndependentColor';
import { ImageEditOperation } from '../enum/ImageEditOperation';
import type { CompatibleImageEditOperation } from '../compatibleEnum/ImageEditOperation';

/**
 * Options for ImageEdit plugin
 */
export default interface ImageEditOptions {
    /**
     * Color of resize/rotate border, handle and icon
     * @default #DB626C
     */
    borderColor?: string | ModeIndependentColor;

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
     * @default ImageEditOperation.ResizeAndRotate
     */
    onSelectState?: ImageEditOperation | CompatibleImageEditOperation;
}
