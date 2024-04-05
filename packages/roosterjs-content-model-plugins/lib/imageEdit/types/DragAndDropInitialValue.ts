import ImageEditInfo from './ImageEditInfo';
import { DNDDirectionX, DnDDirectionY } from './DragAndDropContext';
import { ImageEditElementClass } from './ImageEditElementClass';
import { ImageEditOptions } from './ImageEditOptions';

export interface DragAndDropInitialValue {
    elementClass: ImageEditElementClass;
    editInfo: ImageEditInfo;
    options: ImageEditOptions;
    x: DNDDirectionX;
    y: DnDDirectionY;
}
