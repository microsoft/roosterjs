import DragAndDropContext, { X, Y } from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import { CropInfo } from '../types/ImageEditInfo';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { rotateCoordinate } from './Resizer';

const CROP_HANDLE_SIZE = 22;
const CROP_HANDLE_WIDTH = 7;
const Xs: X[] = ['w', 'e'];
const Ys: Y[] = ['s', 'n'];
const ROTATION: Record<string, number> = {
    sw: 0,
    nw: 90,
    ne: 180,
    se: 270,
};

/**
 * Crop handle for DragAndDropHelper
 */
const Cropper: DragAndDropHandler<DragAndDropContext, CropInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, x, y, options }, e, base, dx, dy) => {
        [dx, dy] = rotateCoordinate(dx, dy, editInfo.angle);

        const { width, height, left, right, top, bottom } = editInfo;
        const { minWidth, minHeight } = options;

        const fullWidth = width / (1 - left - right);
        const fullHeight = height / (1 - top - bottom);
        const newLeft = x != 'e' ? crop(base.left, dx, fullWidth, right, minWidth) : left;
        const newRight = x != 'w' ? crop(base.right, -dx, fullWidth, left, minWidth) : right;
        const newTop = y != 's' ? crop(base.top, dy, fullHeight, bottom, minHeight) : top;
        const newBottom = y != 'n' ? crop(base.bottom, -dy, fullHeight, top, minHeight) : bottom;

        editInfo.left = newLeft;
        editInfo.right = newRight;
        editInfo.top = newTop;
        editInfo.bottom = newBottom;
        editInfo.width = fullWidth * (1 - newLeft - newRight);
        editInfo.height = fullHeight * (1 - newTop - newBottom);

        return true;
    },
};

function crop(
    basePercentage: number,
    deltaValue: number,
    fullValue: number,
    currentPercentage: number,
    minValue: number
): number {
    const maxValue = fullValue * (1 - currentPercentage) - minValue;
    const newValue = fullValue * basePercentage + deltaValue;
    const validValue = Math.max(Math.min(newValue, maxValue), 0);
    return validValue / fullValue;
}

/**
 * @internal
 */
export default Cropper;

/**
 * @internal
 * Get HTML for crop elements, including 4 overlays (to show dark shadow), 1 container and 4 crop handles
 */
export function getCropHTML(): string {
    const overlayHTML = `<div style="position:absolute;background-color:rgb(0,0,0,0.5);pointer-events:none" class="${ImageEditElementClass.CropOverlay}"></div>`;
    const handlesHTML = Xs.map(x => Ys.map(y => getCropHTMLInternal(x, y)).join('')).join('');
    const containerHTML = `
        <div style="position:absolute;overflow:hidden" class="${ImageEditElementClass.CropContainer}">
            ${handlesHTML}
        </div>`;

    return containerHTML + overlayHTML + overlayHTML + overlayHTML + overlayHTML;
}

function getCropHTMLInternal(x: X, y: Y) {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const rotation = ROTATION[y + x];
    const context = `data-x="${x}" data-y="${y}"`;

    return `
        <div class="${
            ImageEditElementClass.CropHandle
        }" ${context} style="position:absolute;pointer-events:auto;cursor:${y}${x}-resize;${leftOrRight}:0;${topOrBottom}:0;width:${CROP_HANDLE_SIZE}px;height:${CROP_HANDLE_SIZE}px;transform:rotate(${rotation}deg)">
            ${getCropHandleHTML()}
        </div>`;
}

function getCropHandleHTML(): string {
    return [0, 1]
        .map(layer => [0, 1].map(dir => getCropHandleHTMLInternal(layer, dir)).join(''))
        .join('');
}

function getCropHandleHTMLInternal(layer: number, dir: number): string {
    const position =
        dir == 0
            ? `right:${layer}px;height:${CROP_HANDLE_WIDTH - layer * 2}px;`
            : `top:${layer}px;width:${CROP_HANDLE_WIDTH - layer * 2}px;`;
    const bgColor = layer == 0 ? 'white' : 'black';

    return `<div style="position:absolute;left:${layer}px;bottom:${layer}px;${position};background-color:${bgColor}"></div>`;
}
