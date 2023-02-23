import DragAndDropContext, { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import ImageEditInfo, { ResizeInfo } from '../types/ImageEditInfo';
import ImageHtmlOptions from '../types/ImageHtmlOptions';
import { CreateElementData } from 'roosterjs-editor-types';
import { ImageEditElementClass } from '../types/ImageEditElementClass';

/**
 * An optional callback to allow customize resize handle element of image resizing.
 * To customize the resize handle element, add this callback and change the attributes of elementData then it
 * will be picked up by ImageEdit code
 */
export interface OnShowResizeHandle {
    (elementData: CreateElementData, x: DNDDirectionX, y: DnDDirectionY): void;
}

const enum HandleTypes {
    SquareHandles,
    CircularHandlesCorner,
}
const RESIZE_HANDLE_SIZE = 10;
const RESIZE_HANDLE_MARGIN = 3;
const Xs: DNDDirectionX[] = ['w', '', 'e'];
const Ys: DnDDirectionY[] = ['s', '', 'n'];

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
export function getCornerResizeHTML(
    { borderColor: resizeBorderColor }: ImageHtmlOptions,
    onShowResizeHandle?: OnShowResizeHandle
): CreateElementData[] {
    const result: CreateElementData[] = [];

    Xs.forEach(x =>
        Ys.forEach(y => {
            let elementData =
                (x == '') == (y == '')
                    ? getResizeHandleHTML(
                          x,
                          y,
                          resizeBorderColor,
                          HandleTypes.CircularHandlesCorner
                      )
                    : null;
            if (onShowResizeHandle && elementData) {
                onShowResizeHandle(elementData, x, y);
            }
            if (elementData) {
                result.push(elementData);
            }
        })
    );
    return result;
}

/**
 * @internal
 * Get HTML for resize handles on the sides
 */
export function getSideResizeHTML(
    { borderColor: resizeBorderColor, isSmallImage: isSmallImage }: ImageHtmlOptions,
    onShowResizeHandle?: OnShowResizeHandle
): CreateElementData[] | null {
    if (isSmallImage) {
        return null;
    }
    const result: CreateElementData[] = [];
    Xs.forEach(x =>
        Ys.forEach(y => {
            let elementData =
                (x == '') != (y == '')
                    ? getResizeHandleHTML(
                          x,
                          y,
                          resizeBorderColor,
                          HandleTypes.CircularHandlesCorner
                      )
                    : null;
            if (onShowResizeHandle && elementData) {
                onShowResizeHandle(elementData, x, y);
            }
            if (elementData) {
                result.push(elementData);
            }
        })
    );
    return result;
}

/**
 * @internal
 * Get HTML for resize borders
 */
export function getResizeBordersHTML({
    borderColor: resizeBorderColor,
}: ImageHtmlOptions): CreateElementData {
    return {
        tag: 'div',
        style: `position:absolute;left:0;right:0;top:0;bottom:0;border:solid 2px ${resizeBorderColor};pointer-events:none;`,
    };
}

function getResizeHandleHTML(
    x: DNDDirectionX,
    y: DnDDirectionY,
    borderColor: string,
    handleTypes: HandleTypes
): CreateElementData | null {
    const leftOrRight = x == 'w' ? 'left' : 'right';
    const topOrBottom = y == 'n' ? 'top' : 'bottom';
    const leftOrRightValue = x == '' ? '50%' : '0px';
    const topOrBottomValue = y == '' ? '50%' : '0px';
    const direction = y + x;
    return x == '' && y == ''
        ? null
        : {
              tag: 'div',
              style: `position:absolute;${leftOrRight}:${leftOrRightValue};${topOrBottom}:${topOrBottomValue}`,
              children: [
                  {
                      tag: 'div',
                      style: setHandleStyle[handleTypes](
                          direction,
                          topOrBottom,
                          leftOrRight,
                          borderColor
                      ),
                      className: ImageEditElementClass.ResizeHandle,
                      dataset: { x, y },
                  },
              ],
          };
}

const setHandleStyle: Record<
    HandleTypes,
    (direction: string, topOrBottom: string, leftOrRight: string, borderColor: string) => string
> = {
    0: (direction, leftOrRight, topOrBottom, borderColor) =>
        `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: ${borderColor};cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;`,
    1: (direction, leftOrRight, topOrBottom) =>
        `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: #FFFFFF;cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;border-radius:100%;border: 2px solid #bfbfbf;box-shadow: 0px 0.36316px 1.36185px rgba(100, 100, 100, 0.25);`,
};
