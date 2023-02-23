import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import { CreateElementData } from 'roosterjs-editor-types';
import { CropInfo } from '../types/ImageEditInfo';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { rotateCoordinate } from './Resizer';

const CROP_HANDLE_SIZE = 22;
const CROP_HANDLE_WIDTH = 7;
const Xs: DNDDirectionX[] = ['w', 'e'];
const Ys: DnDDirectionY[] = ['s', 'n'];
const ROTATION: Record<string, number> = {
    sw: 0,
    nw: 90,
    ne: 180,
    se: 270,
};

/**
 * @internal
 * Crop handle for DragAndDropHelper
 */
export const Cropper: DragAndDropHandler<DragAndDropContext, CropInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, x, y, options }, e, base, dx, dy) => {
        [dx, dy] = rotateCoordinate(dx, dy, editInfo.angleRad);

        const {
            widthPx,
            heightPx,
            leftPercent,
            rightPercent,
            topPercent,
            bottomPercent,
        } = editInfo;
        const { minWidth, minHeight } = options;
        const widthPercent = 1 - leftPercent - rightPercent;
        const heightPercent = 1 - topPercent - bottomPercent;

        if (
            widthPercent > 0 &&
            heightPercent > 0 &&
            minWidth !== undefined &&
            minHeight !== undefined
        ) {
            const fullWidth = widthPx / widthPercent;
            const fullHeight = heightPx / heightPercent;
            const newLeft =
                x != 'e'
                    ? crop(base.leftPercent, dx, fullWidth, rightPercent, minWidth)
                    : leftPercent;
            const newRight =
                x != 'w'
                    ? crop(base.rightPercent, -dx, fullWidth, leftPercent, minWidth)
                    : rightPercent;
            const newTop =
                y != 's'
                    ? crop(base.topPercent, dy, fullHeight, bottomPercent, minHeight)
                    : topPercent;
            const newBottom =
                y != 'n'
                    ? crop(base.bottomPercent, -dy, fullHeight, topPercent, minHeight)
                    : bottomPercent;

            editInfo.leftPercent = newLeft;
            editInfo.rightPercent = newRight;
            editInfo.topPercent = newTop;
            editInfo.bottomPercent = newBottom;
            editInfo.widthPx = fullWidth * (1 - newLeft - newRight);
            editInfo.heightPx = fullHeight * (1 - newTop - newBottom);

            return true;
        } else {
            return false;
        }
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
        style: 'position:absolute;overflow:hidden',
        className: ImageEditElementClass.CropContainer,
        children: [],
    };
    if (containerHTML) {
        Xs.forEach(x => Ys.forEach(y => containerHTML.children?.push(getCropHTMLInternal(x, y))));
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
