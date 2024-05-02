import { createElement } from '../../pluginUtils/CreateElement/createElement';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import type { CreateElementData } from '../../pluginUtils/CreateElement/CreateElementData';
import type { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import {
    CROP_HANDLE_SIZE,
    CROP_HANDLE_WIDTH,
    ROTATION,
    XS_CROP,
    YS_CROP,
} from '../constants/constants';

/**
 * @internal
 */
export function createImageCropper(doc: Document) {
    const cropper = getCropHTML()
        .map(data => {
            const cropper = createElement(data, doc);
            if (
                cropper &&
                isNodeOfType(cropper, 'ELEMENT_NODE') &&
                isElementOfType(cropper, 'div')
            ) {
                return cropper;
            }
        })
        .filter(cropper => !!cropper) as HTMLDivElement[];
    return cropper;
}

/**
 * @internal
 * Get HTML for crop elements, including 4 overlays (to show dark shadow), 1 container and 4 crop handles
 */
export function getCropHTML(): CreateElementData[] {
    const overlayHTML: CreateElementData = {
        tag: 'div',
        style: 'position:absolute;background-color:rgb(0,0,0,0.5);pointer-events:none',
        className: ImageEditElementClass.CropOverlay,
    };
    const containerHTML: CreateElementData = {
        tag: 'div',
        style: 'position:absolute;overflow:hidden;inset:0px;',
        className: ImageEditElementClass.CropContainer,
        children: [],
    };

    if (containerHTML) {
        XS_CROP.forEach(x =>
            YS_CROP.forEach(y => containerHTML.children?.push(getCropHTMLInternal(x, y)))
        );
    }
    return [containerHTML, overlayHTML, overlayHTML, overlayHTML, overlayHTML];
}

function getCropHTMLInternal(x: DNDDirectionX, y: DnDDirectionY): CreateElementData {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const rotation = ROTATION[y + x];

    return {
        tag: 'div',
        className: ImageEditElementClass.CropHandle,
        style: `position:absolute;pointer-events:auto;cursor:${y}${x}-resize;${leftOrRight}:0;${topOrBottom}:0;width:${CROP_HANDLE_SIZE}px;height:${CROP_HANDLE_SIZE}px;transform:rotate(${rotation}deg)`,
        dataset: { x, y },
        children: getCropHandleHTML(),
    };
}

function getCropHandleHTML(): CreateElementData[] {
    const result: CreateElementData[] = [];
    [0, 1].forEach(layer =>
        [0, 1].forEach(dir => {
            result.push(getCropHandleHTMLInternal(layer, dir));
        })
    );
    return result;
}

function getCropHandleHTMLInternal(layer: number, dir: number): CreateElementData {
    const position =
        dir == 0
            ? `right:${layer}px;height:${CROP_HANDLE_WIDTH - layer * 2}px;`
            : `top:${layer}px;width:${CROP_HANDLE_WIDTH - layer * 2}px;`;
    const bgColor = layer == 0 ? 'white' : 'black';

    return {
        tag: 'div',
        style: `position:absolute;left:${layer}px;bottom:${layer}px;${position};background-color:${bgColor}`,
    };
}
