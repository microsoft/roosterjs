import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { ImageEditOptions } from 'roosterjs-content-model-plugins/lib';
import { ImageMetadataFormat } from 'roosterjs-content-model-types/lib';

export function startDropAndDragHelpers(
    handle: HTMLDivElement,
    editInfo: ImageMetadataFormat,
    options: ImageEditOptions,
    elementClass: ImageEditElementClass,
    helper: DragAndDropHandler<DragAndDropContext, any>,
    updateWrapper: (context: DragAndDropContext, _handle: HTMLElement) => void
): DragAndDropHelper<DragAndDropContext, any> {
    return new DragAndDropHelper<DragAndDropContext, any>(
        handle,
        {
            elementClass,
            editInfo: editInfo,
            options: options,
            x: handle.dataset.x as DNDDirectionX,
            y: handle.dataset.y as DnDDirectionY,
        },
        updateWrapper,
        helper,
        1
    );
}
