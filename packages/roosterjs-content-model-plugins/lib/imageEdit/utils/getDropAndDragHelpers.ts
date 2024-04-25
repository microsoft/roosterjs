import { DragAndDropHelper } from '../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { toArray } from 'roosterjs-content-model-dom';
import type { ImageMetadataFormat } from 'roosterjs-content-model-types';
import type { ImageEditOptions } from '../types/ImageEditOptions';
import type { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { DragAndDropContext, DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';

/**
 * @internal
 */
export function getDropAndDragHelpers(
    wrapper: HTMLElement,
    editInfo: ImageMetadataFormat,
    options: ImageEditOptions,
    elementClass: ImageEditElementClass,
    helper: DragAndDropHandler<DragAndDropContext, any>,
    updateWrapper: (context: DragAndDropContext, _handle: HTMLElement) => void,
    zoomScale: number
): DragAndDropHelper<DragAndDropContext, any>[] {
    return getEditElements(wrapper, elementClass).map(
        element =>
            new DragAndDropHelper<DragAndDropContext, any>(
                element,
                {
                    editInfo: editInfo,
                    options: options,
                    elementClass,
                    x: element.dataset.x as DNDDirectionX,
                    y: element.dataset.y as DnDDirectionY,
                },
                updateWrapper,
                helper,
                zoomScale
            )
    );
}

function getEditElements(wrapper: HTMLElement, elementClass: ImageEditElementClass): HTMLElement[] {
    return toArray(wrapper.querySelectorAll('.' + elementClass)) as HTMLElement[];
}
