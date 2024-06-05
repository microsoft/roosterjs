import { createElement } from '../../pluginUtils/CreateElement/createElement';
import { ImageEditElementClass } from '../types/ImageEditElementClass';
import { isElementOfType, isNodeOfType } from 'roosterjs-content-model-dom';
import { Xs, Ys } from '../constants/constants';
import type { CreateElementData } from '../../pluginUtils/CreateElement/CreateElementData';
import type { DNDDirectionX, DnDDirectionY } from '../types/DragAndDropContext';
/**
 * @internal
 */
export interface OnShowResizeHandle {
    (elementData: CreateElementData, x: DNDDirectionX, y: DnDDirectionY): void;
}

const RESIZE_HANDLE_MARGIN = 6;
const RESIZE_HANDLE_SIZE = 10;

/**
 * @internal
 */
export function createImageResizer(
    doc: Document,
    onShowResizeHandle?: OnShowResizeHandle
): HTMLDivElement[] {
    const cornerElements = getCornerResizeHTML(onShowResizeHandle);
    const sideElements = getSideResizeHTML(onShowResizeHandle);
    const handles = [...cornerElements, ...sideElements]
        .map(element => {
            const handle = createElement(element, doc);
            if (isNodeOfType(handle, 'ELEMENT_NODE') && isElementOfType(handle, 'div')) {
                return handle;
            }
        })
        .filter(element => !!element) as HTMLDivElement[];
    return handles;
}

/**
 * @internal
 * Get HTML for resize handles at the corners
 */
function getCornerResizeHTML(onShowResizeHandle?: OnShowResizeHandle): CreateElementData[] {
    const result: CreateElementData[] = [];

    Xs.forEach(x =>
        Ys.forEach(y => {
            const elementData = (x == '') == (y == '') ? getResizeHandleHTML(x, y) : null;
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
function getSideResizeHTML(onShowResizeHandle?: OnShowResizeHandle): CreateElementData[] {
    const result: CreateElementData[] = [];
    Xs.forEach(x =>
        Ys.forEach(y => {
            const elementData = (x == '') != (y == '') ? getResizeHandleHTML(x, y) : null;
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

const createHandleStyle = (direction: string, topOrBottom: string, leftOrRight: string) => {
    return `position:relative;width:${RESIZE_HANDLE_SIZE}px;height:${RESIZE_HANDLE_SIZE}px;background-color: #FFFFFF;cursor:${direction}-resize;${topOrBottom}:-${RESIZE_HANDLE_MARGIN}px;${leftOrRight}:-${RESIZE_HANDLE_MARGIN}px;border-radius:100%;border: 2px solid #bfbfbf;box-shadow: 0px 0.36316px 1.36185px rgba(100, 100, 100, 0.25);`;
};

function getResizeHandleHTML(x: DNDDirectionX, y: DnDDirectionY): CreateElementData | null {
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
                      style: createHandleStyle(direction, topOrBottom, leftOrRight),
                      className: ImageEditElementClass.ResizeHandle,
                      dataset: { x, y },
                  },
              ],
          };
}
