import DragAndDropContext from '../types/DragAndDropContext';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { ImageResizeMetadataFormat } from 'roosterjs-content-model-types/lib';
import { rotateCoordinate } from '../utils/imageEditUtils';

/**
 * @internal
 * The resize drag and drop handler
 */
export const Resizer: DragAndDropHandler<DragAndDropContext, ImageResizeMetadataFormat> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ x, y, editInfo, options }, e, base, deltaX, deltaY) => {
        if (
            base.heightPx &&
            base.widthPx &&
            options.minWidth !== undefined &&
            options.minHeight !== undefined
        ) {
            const ratio =
                base.widthPx > 0 && base.heightPx > 0 ? (base.widthPx * 1.0) / base.heightPx : 0;
            [deltaX, deltaY] = rotateCoordinate(deltaX, deltaY, editInfo.angleRad ?? 0);
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
