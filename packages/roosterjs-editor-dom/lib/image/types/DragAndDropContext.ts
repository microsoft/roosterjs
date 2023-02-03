import ImageEditInfo from './ImageEditInfo';
import { ImageEditElementClass } from './ImageEditElementClass';
import { ImageEditOptions } from 'roosterjs-editor-types';

/**
 * Horizontal direction types for image edit
 */
export type DNDDirectionX = 'w' | '' | 'e';

/**
 * Vertical direction types for image edit
 */
export type DnDDirectionY = 'n' | '' | 's';

/**
 * @internal
 * Context object of image editing for DragAndDropHelper
 */
export default interface DragAndDropContext {
    /**
     * The CSS class name of this editing element
     */
    elementClass: ImageEditElementClass;

    /**
     * Edit info of current image, can be modified by handlers
     */
    editInfo: ImageEditInfo;

    /**
     * Horizontal direction
     */
    x: DNDDirectionX;

    /**
     * Vertical direction
     */
    y: DnDDirectionY;

    /**
     * Edit options
     */
    options: ImageEditOptions;
}
