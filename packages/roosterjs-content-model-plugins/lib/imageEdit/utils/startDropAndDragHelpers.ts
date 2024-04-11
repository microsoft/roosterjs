import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { ImageEditOptions } from 'roosterjs-content-model-plugins/lib';
import { ImageMetadataFormat } from 'roosterjs-content-model-types/lib';
import { isNodeOfType } from 'roosterjs-content-model-dom/lib';

/**
 * @internal
 */
export function startDropAndDragHelpers(
    handle: Element,
    editInfo: ImageMetadataFormat,
    options: ImageEditOptions,
    elementClass: ImageEditElementClass,
    helper: DragAndDropHandler<DragAndDropContext, any>,
    updateWrapper: (context: DragAndDropContext, _handle: HTMLElement) => void
): DragAndDropHelper<DragAndDropContext, any> | undefined {
    return isNodeOfType(handle, 'ELEMENT_NODE')
        ? new DragAndDropHelper<DragAndDropContext, any>(
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
          )
        : undefined;
}
