import DragAndDropContext, { X, Y } from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import ImageEditInfo, { ResizeInfo } from '../types/ImageEditInfo';
import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { CreateElementData } from 'roosterjs-editor-types';
import { ImageEditElementClass } from '../types/ImageEditElementClass';

const RESIZE_HANDLE_SIZE = 7;
const RESIZE_HANDLE_MARGIN = 3;
const Xs: X[] = ['w', '', 'e'];
const Ys: Y[] = ['s', '', 'n'];

/**
 * The resize drag and drop handler
 */
const Resizer: DragAndDropHandler<DragAndDropContext, ResizeInfo> = {
    onDragStart: ({ editInfo }) => ({ ...editInfo }),
    onDragging: ({ x, y, editInfo, options }, e, base, deltaX, deltaY) => {
        const ratio =
            base.widthPx > 0 && base.heightPx > 0 ? (base.widthPx * 1.0) / base.heightPx : 0;

        [deltaX, deltaY] = rotateCoordinate(deltaX, deltaY, editInfo.angleRad);

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
            newHeight = Math.min(newHeight, newWidth / ratio);
            newWidth = Math.min(newWidth, newHeight * ratio);

            if (newWidth < newHeight * ratio) {
                newWidth = newHeight * ratio;
            } else {
                newHeight = newWidth / ratio;
            }
        }

        editInfo.widthPx = newWidth;
        editInfo.heightPx = newHeight;

        return true;
    },
};

/**
 * @internal
 */
export default Resizer;

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

/**
 * @internal
 * Double check if the changed size can satisfy current width of container.
 * When resize an image and preserve ratio, its size can be limited by the size of container.
 * So we need to check the actual size and calculate the size again
 * @param editInfo Edit info of the image
 * @param preserveRatio Whether w/h ratio need to be preserved
 * @param actualWidth Actual width of the image after resize
 * @param actualHeight Actual height of the image after resize
 */
export function doubleCheckResize(
    editInfo: ImageEditInfo,
    preserveRatio: boolean,
    actualWidth: number,
    actualHeight: number
) {
    let { widthPx, heightPx } = editInfo;
    const ratio = heightPx > 0 ? widthPx / heightPx : 0;

    actualWidth = Math.floor(actualWidth);
    actualHeight = Math.floor(actualHeight);
    widthPx = Math.floor(widthPx);
    heightPx = Math.floor(heightPx);

    editInfo.widthPx = actualWidth;
    editInfo.heightPx = actualHeight;

    if (preserveRatio && ratio > 0 && (widthPx !== actualWidth || heightPx !== actualHeight)) {
        if (actualWidth < widthPx) {
            editInfo.heightPx = actualWidth / ratio;
        } else {
            editInfo.widthPx = actualHeight * ratio;
        }
    }
}

/**
 * @internal
 * Get HTML for resize handles at the corners
 */
export function getCornerResizeHTML({
    borderColor: resizeBorderColor,
}: ImageHtmlOptions): CreateElementData[] {
    const result: CreateElementData[] = [];
    Xs.forEach(x =>
        Ys.forEach(y =>
            result.push(
                (x == '') == (y == '') ? getResizeHandleHTML(x, y, resizeBorderColor) : null
            )
        )
    );
    return result;
}

/**
 * @internal
 * Get HTML for resize handles on the sides
 */
export function getSideResizeHTML({
    borderColor: resizeBorderColor,
}: ImageHtmlOptions): CreateElementData[] {
    const result: CreateElementData[] = [];
    Xs.forEach(x =>
        Ys.forEach(y =>
            result.push(
                (x == '') != (y == '') ? getResizeHandleHTML(x, y, resizeBorderColor) : null
            )
        )
    );
    return result;
}

function getResizeHandleHTML(x: X, y: Y, borderColor: string): CreateElementData {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const leftOrRightValue = x == '' ? '50%' : '0px';
    const topOrBottomValue = y == '' ? '50%' : '0px';
    const direction = y + x;

    return x == '' && y == ''
        ? {
              tag: 'div',
              style: `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 1px ${borderColor};pointer-events:none`,
          }
        : {
              tag: 'div',
              style: `position:absolute;${leftOrRight}:${leftOrRightValue};${topOrBottom}:${topOrBottomValue}`,
              children: [
                  {
                      tag: 'div',
                      style: `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: ${borderColor};cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px`,
                      className: ImageEditElementClass.ResizeHandle,
                      dataset: { x, y },
                  },
              ],
          };
}
