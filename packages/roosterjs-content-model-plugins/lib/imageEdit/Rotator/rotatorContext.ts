import { DEFAULT_ROTATE_HANDLE_HEIGHT, DEG_PER_RAD } from '../constants/constants';
import { DragAndDropHandler } from '../../pluginUtils/DragAndDrop/DragAndDropHandler';
import { ImageRotateMetadataFormat } from 'roosterjs-content-model-types';
import type { DragAndDropContext } from '../types/DragAndDropContext';

/**
 * @internal
 * The rotate drag and drop handler
 */
export const Rotator: DragAndDropHandler<DragAndDropContext, ImageRotateMetadataFormat> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, options }, e, base, deltaX, deltaY) => {
        if (editInfo.heightPx) {
            const distance = editInfo.heightPx / 2 + DEFAULT_ROTATE_HANDLE_HEIGHT;
            const newX = distance * Math.sin(base.angleRad ?? 0) + deltaX;
            const newY = distance * Math.cos(base.angleRad ?? 0) - deltaY;
            let angleInRad = Math.atan2(newX, newY);

            if (!e.altKey && options && options.minRotateDeg !== undefined) {
                const angleInDeg = angleInRad * DEG_PER_RAD;
                const adjustedAngleInDeg =
                    Math.round(angleInDeg / options.minRotateDeg) * options.minRotateDeg;
                angleInRad = adjustedAngleInDeg / DEG_PER_RAD;
            }

            if (editInfo.angleRad != angleInRad) {
                editInfo.angleRad = angleInRad;
                return true;
            }
        }
        return false;
    },
};
