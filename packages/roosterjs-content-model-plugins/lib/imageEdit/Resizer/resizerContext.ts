import DragAndDropContext from '../types/DragAndDropContext';
import { DragAndDropHandler } from 'roosterjs-content-model-plugins/lib/pluginUtils/DragAndDrop/DragAndDropHandler';
import { ResizeInfo } from '../types/ImageEditInfo';

/**
 * @internal
 * The resize drag and drop handler
 */
export const Resizer: DragAndDropHandler<DragAndDropContext, ResizeInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ x, y, editInfo, options }, e, base, deltaX, deltaY) => {
        const ratio =
            base.widthPx > 0 && base.heightPx > 0 ? (base.widthPx * 1.0) / base.heightPx : 0;
        [deltaX, deltaY] = rotateCoordinate(deltaX, deltaY, editInfo.angleRad);
        if (options.minWidth !== undefined && options.minHeight !== undefined) {
            const horizontalOnly = x == '';
            const verticalOnly = y == '';
            const shouldPreserveRatio =
                !(horizontalOnly || verticalOnly) && (options.preserveRatio || e.shiftKey);
            let newWidth = horizontalOnly
                ? base.widthPx
                : Math.max(base.widthPx + deltaX * (x == 'w' ? -1 : 1), options.minWidth);
            let newHeight = verticalOnly
                ? base.heightPx
                : Math.max(base.heightPx + deltaY * (y == 'n' ? -1 : 1), options.minHeight);

            if (shouldPreserveRatio && ratio > 0) {
                if (ratio > 1) {
                    // first sure newHeight is right，calculate newWidth
                    newWidth = newHeight * ratio;
                    if (newWidth < options.minWidth) {
                        newWidth = options.minWidth;
                        newHeight = newWidth / ratio;
                    }
                } else {
                    // first sure newWidth is right，calculate newHeight
                    newHeight = newWidth / ratio;
                    if (newHeight < options.minHeight) {
                        newHeight = options.minHeight;
                        newWidth = newHeight * ratio;
                    }
                }
            }

            editInfo.widthPx = newWidth;
            editInfo.heightPx = newHeight;
            return true;
        } else {
            return false;
        }
    },
};
/**
 * @internal Calculate the rotated x and y distance for mouse moving
 * @param x Original x distance
 * @param y Original y distance
 * @param angle Rotated angle, in radian
 * @returns rotated x and y distances
 */
export function rotateCoordinate(x: number, y: number, angle: number): [number, number] {
    if (x == 0 && y == 0) {
        return [0, 0];
    }
    const hypotenuse = Math.sqrt(x * x + y * y);
    angle = Math.atan2(y, x) - angle;
    return [hypotenuse * Math.cos(angle), hypotenuse * Math.sin(angle)];
}
