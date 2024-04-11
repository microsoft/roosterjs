import { DNDDirectionX, DnDDirectionY } from './DragAndDropContext';
import { ImageEditElementClass } from './ImageEditElementClass';
import { ImageEditOptions } from './ImageEditOptions';
import { ImageMetadataFormat } from 'roosterjs-content-model-types/lib';

/**
 * @internal
 */
export interface DragAndDropInitialValue {
    elementClass: ImageEditElementClass;
    editInfo: ImageMetadataFormat;
    options: ImageEditOptions;
    x: DNDDirectionX;
    y: DnDDirectionY;
}
