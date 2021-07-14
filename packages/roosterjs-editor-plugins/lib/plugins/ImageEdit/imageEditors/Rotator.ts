import DragAndDropContext from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { RotateInfo } from '../types/ImageEditInfo';

/**
 * @internal Size of rotate icon
 */
export const ROTATE_SIZE = 32;

/**
 * @internal Gap between image and the rotate handle
 */
export const ROTATE_GAP = 15;

const DEG_PER_RAD = 180 / Math.PI;
const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;
const ROTATE_ICON_MARGIN = 8;

/**
 * The rotate drag and drop handler
 */
const Rotator: DragAndDropHandler<DragAndDropContext, RotateInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, options }, e, base, deltaX, deltaY) => {
        const distance = editInfo.height / 2 + DEFAULT_ROTATE_HANDLE_HEIGHT;
        const newX = distance * Math.sin(base.angle) + deltaX;
        const newY = distance * Math.cos(base.angle) - deltaY;
        let angleInRad = Math.atan2(newX, newY);

        if (!e.altKey) {
            const angleInDeg = angleInRad * DEG_PER_RAD;
            const adjustedAngleInDeg =
                Math.round(angleInDeg / options.minRotateDeg) * options.minRotateDeg;
            angleInRad = adjustedAngleInDeg / DEG_PER_RAD;
        }

        if (editInfo.angle != angleInRad) {
            editInfo.angle = angleInRad;
            return true;
        } else {
            return false;
        }
    },
};

/**
 * @internal
 */
export default Rotator;

/**
 * @internal
 * Get HTML for rotate elements, including the rotate handle with icon, and a line between the handle and the image
 */
export function getRotateHTML({
    borderColor,
    rotateIconHTML: rotateHandleHTML,
    rotateHandleBackColor,
}: ImageHtmlOptions): string {
    const handleLeft = ROTATE_SIZE / 2;
    return `
        <div class="${
            ImageEditElementClass.RotateCenter
        }" style="position:absolute;left:50%;width:1px;background-color:${borderColor}">
            <div class="${
                ImageEditElementClass.RotateHandle
            }" style="position:absolute;background-color:${rotateHandleBackColor};border:solid 1px ${borderColor};border-radius:50%;width:${ROTATE_SIZE}px;height:${ROTATE_SIZE}px;left:-${handleLeft}px;cursor:move">
                ${rotateHandleHTML || getRotateIconHTML(borderColor)}
            </div>
        </div>`;
}

function getRotateIconHTML(borderColor: string): string {
    return `
        <svg style="width:16px;height:16px;margin: ${ROTATE_ICON_MARGIN}px ${ROTATE_ICON_MARGIN}px">
            <path d="M 10.5,10.0 A 3.8,3.8 0 1 1 6.7,6.3" transform="matrix(1.1 1.1 -1.1 1.1 11.6 -10.8)" fill-opacity="0" stroke-width="1" stroke="${borderColor}" />
            <path d="M12.0 3.648l.884-.884.53 2.298-2.298-.53z" stroke="${borderColor}" />
        </svg>`;
}
