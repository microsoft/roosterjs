import DragAndDropContext from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { CreateElementData, Rect } from 'roosterjs-editor-types';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { RotateInfo } from '../types/ImageEditInfo';

const ROTATE_SIZE = 32;
const ROTATE_GAP = 15;
const DEG_PER_RAD = 180 / Math.PI;
const DEFAULT_ROTATE_HANDLE_HEIGHT = ROTATE_SIZE / 2 + ROTATE_GAP;
const ROTATE_ICON_MARGIN = 8;

/**
 * @internal
 * The rotate drag and drop handler
 */
export const Rotator: DragAndDropHandler<DragAndDropContext, RotateInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ editInfo, options }, e, base, deltaX, deltaY) => {
        const distance = editInfo.heightPx / 2 + DEFAULT_ROTATE_HANDLE_HEIGHT;
        const newX = distance * Math.sin(base.angleRad) + deltaX;
        const newY = distance * Math.cos(base.angleRad) - deltaY;
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
        } else {
            return false;
        }
    },
};

/**
 * @internal
 * Move rotate handle. When image is very close to the border of editor, rotate handle may not be visible.
 * Fix it by reduce the distance from image to rotate handle
 */
export function updateRotateHandlePosition(
    editorRect: Rect,
    rotateCenter: HTMLElement,
    rotateHandle: HTMLElement
) {
    const rotateHandleRect = rotateHandle.getBoundingClientRect();

    if (rotateHandleRect) {
        const top = rotateHandleRect.top - editorRect.top;
        const left = rotateHandleRect.left - editorRect.left;
        const right = rotateHandleRect.right - editorRect.right;
        const bottom = rotateHandleRect.bottom - editorRect.bottom;
        let adjustedDistance = Number.MAX_SAFE_INTEGER;
        if (top <= 0) {
            adjustedDistance = top;
        } else if (left <= 0) {
            adjustedDistance = left;
        } else if (right >= 0) {
            adjustedDistance = right;
        } else if (bottom >= 0) {
            adjustedDistance = bottom;
        }

        const rotateGap = Math.max(Math.min(ROTATE_GAP, adjustedDistance), 0);
        const rotateTop = Math.max(Math.min(ROTATE_SIZE, adjustedDistance - rotateGap), 0);
        rotateCenter.style.top = -rotateGap + 'px';
        rotateCenter.style.height = rotateGap + 'px';
        rotateHandle.style.top = -rotateTop + 'px';
    }
}

/**
 * @internal
 * Get HTML for rotate elements, including the rotate handle with icon, and a line between the handle and the image
 */
export function getRotateHTML({
    borderColor,
    rotateHandleBackColor,
}: ImageHtmlOptions): CreateElementData[] {
    const handleLeft = ROTATE_SIZE / 2;
    return [
        {
            tag: 'div',
            className: ImageEditElementClass.RotateCenter,
            style: `position:absolute;left:50%;width:1px;background-color:${borderColor};top:${-ROTATE_GAP}px;height:${ROTATE_GAP}px;`,
            children: [
                {
                    tag: 'div',
                    className: ImageEditElementClass.RotateHandle,
                    style: `position:absolute;background-color:${rotateHandleBackColor};border:solid 1px ${borderColor};border-radius:50%;width:${ROTATE_SIZE}px;height:${ROTATE_SIZE}px;left:-${handleLeft}px;cursor:move;top:${-ROTATE_SIZE}px;`,
                    children: [getRotateIconHTML(borderColor)],
                },
            ],
        },
    ];
}

function getRotateIconHTML(borderColor: string): CreateElementData {
    return {
        tag: 'svg',
        namespace: 'http://www.w3.org/2000/svg',
        style: `width:16px;height:16px;margin: ${ROTATE_ICON_MARGIN}px ${ROTATE_ICON_MARGIN}px`,
        children: [
            {
                tag: 'path',
                namespace: 'http://www.w3.org/2000/svg',
                attributes: {
                    d: 'M 10.5,10.0 A 3.8,3.8 0 1 1 6.7,6.3',
                    transform: 'matrix(1.1 1.1 -1.1 1.1 11.6 -10.8)',
                    ['fill-opacity']: '0',
                    stroke: borderColor,
                },
            },
            {
                tag: 'path',
                namespace: 'http://www.w3.org/2000/svg',
                attributes: {
                    d: 'M12.0 3.648l.884-.884.53 2.298-2.298-.53z',
                    stroke: borderColor,
                },
            },
        ],
    };
}
