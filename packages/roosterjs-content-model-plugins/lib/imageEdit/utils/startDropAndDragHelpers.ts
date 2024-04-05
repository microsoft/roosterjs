import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import ImageEditInfo from 'roosterjs-editor-plugins/lib/plugins/ImageEdit/types/ImageEditInfo';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { ImageEditOptions } from 'roosterjs-content-model-plugins/lib';

export function startDropAndDragHelpers(
    handles: HTMLDivElement[],
    editInfo: ImageEditInfo,
    options: ImageEditOptions,
    elementClass: ImageEditElementClass,
    helper: DragAndDropHandler<DragAndDropContext, any>,
    updateWrapper: (context: DragAndDropContext, _handle: HTMLElement) => void
): DragAndDropHelper<DragAndDropContext, any>[] {
    return handles.map(handle => {
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
    });
}
