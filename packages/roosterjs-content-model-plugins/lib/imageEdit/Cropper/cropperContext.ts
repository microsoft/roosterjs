import DragAndDropContext from '../types/DragAndDropContext';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { ImageCropMetadataFormat } from 'roosterjs-content-model-types/lib';
import { rotateCoordinate } from '../utils/imageEditUtils';

/**
 * @internal
 * Crop handle for DragAndDropHelper
 */
export const Cropper: DragAndDropHandler<DragAndDropContext, ImageCropMetadataFormat> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, x, y, options }, e, base, dx, dy) => {
        [dx, dy] = rotateCoordinate(dx, dy, editInfo.angleRad ?? 0);

        const {
            widthPx,
            heightPx,
            leftPercent,
            rightPercent,
            topPercent,
            bottomPercent,
        } = editInfo;

        if (
            leftPercent === undefined ||
            rightPercent === undefined ||
            topPercent === undefined ||
            bottomPercent === undefined ||
            base.leftPercent === undefined ||
            base.rightPercent === undefined ||
            base.topPercent === undefined ||
            base.bottomPercent === undefined ||
            widthPx === undefined ||
            heightPx === undefined
        ) {
            return false;
        }

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
