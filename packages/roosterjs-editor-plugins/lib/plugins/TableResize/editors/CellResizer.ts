import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import TableEditFeature from './TableEditorFeature';
import { createElement, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { CreateElementData, Rect } from 'roosterjs-editor-types';

const CELL_RESIZER_WIDTH = 4;
const MIN_CELL_WIDTH = 30;

/**
 * @internal
 */
export default function createCellResizer(
    td: HTMLTableCellElement,
    zoomScale: number,
    isRTL: boolean,
    isHorizontal: boolean,
    onStart: () => void,
    onEnd: () => false,
    onShowHelperElement?: (
        elementData: CreateElementData,
        helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
    ) => void
): TableEditFeature | null {
    const document = td.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: `position: fixed; cursor: ${isHorizontal ? 'row' : 'col'}-resize; user-select: none`,
    };

    onShowHelperElement?.(createElementData, 'CellResizer');

    const div = createElement(createElementData, document) as HTMLDivElement;

    document.body.appendChild(div);

    const context: DragAndDropContext = { td, isRTL, zoomScale, onStart };
    const setPosition = isHorizontal ? setHorizontalPosition : setVerticalPosition;
    setPosition(context, div);

    const handler: DragAndDropHandler<DragAndDropContext, DragAndDropInitValue> = {
        onDragStart,
        onDragging: isHorizontal ? onDraggingHorizontal : onDraggingVertical,
        onDragEnd: onEnd,
    };

    const featureHandler = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
        div,
        context,
        setPosition,
        handler,
        zoomScale
    );

    return { node: td, div, featureHandler };
}

interface DragAndDropContext {
    td: HTMLTableCellElement;
    isRTL: boolean;
    zoomScale: number;
    onStart: () => void;
}

interface DragAndDropInitValue {
    vTable: VTable;
    currentCells: HTMLTableCellElement[];
    nextCells: HTMLTableCellElement[];
    initialX: number;
}

function onDragStart(context: DragAndDropContext, event: MouseEvent): DragAndDropInitValue {
    const { td, isRTL, zoomScale, onStart } = context;
    const vTable = new VTable(td, true /*normalizeSize*/, zoomScale);
    const rect = normalizeRect(td.getBoundingClientRect());

    if (rect) {
        onStart();

        // calculate and retrieve the cells of the two columns shared by the current vertical resizer
        const currentCells = vTable.getCellsWithBorder(isRTL ? rect.left : rect.right, !isRTL);
        const nextCells = vTable.getCellsWithBorder(isRTL ? rect.left : rect.right, isRTL);

        return {
            vTable,
            currentCells,
            nextCells,
            initialX: event.pageX,
        };
    } else {
        return { vTable, currentCells: [], nextCells: [], initialX: 0 }; // Just a fallback
    }
}

function onDraggingHorizontal(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { td, zoomScale } = context;
    const { vTable } = initValue;

    vTable.table.removeAttribute('height');
    vTable.table.style.setProperty('height', null);
    vTable.forEachCellOfCurrentRow(cell => {
        if (cell.td) {
            cell.td.style.setProperty(
                'height',
                cell.td == td ? `${(cell.height ?? 0) / zoomScale + deltaY}px` : null
            );
        }
    });

    // To avoid apply format styles when the table is being resizing, the skipApplyFormat is set to true.
    vTable.writeBack(true /**skipApplyFormat*/);
    return true;
}

function onDraggingVertical(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number
) {
    const { isRTL, zoomScale } = context;
    const { vTable, nextCells, currentCells, initialX } = initValue;

    if (!canResizeColumns(event.pageX, currentCells, nextCells, isRTL, zoomScale)) {
        return false;
    }

    // Since we allow the user to resize the table width on adjusting the border of the last cell,
    // we need to make the table width resizable by setting it as null;
    // We also allow the user to resize the table width if Shift key is pressed
    const isLastCell = nextCells.length == 0;
    const isShiftPressed = event.shiftKey;

    if (isLastCell || isShiftPressed) {
        vTable.table.style.setProperty('width', null);
    }

    const newWidthList = new Map<HTMLTableCellElement, number>();
    currentCells.forEach(td => {
        const rect = normalizeRect(td.getBoundingClientRect());

        if (rect) {
            td.style.wordBreak = 'break-word';
            td.style.whiteSpace = 'normal';
            td.style.boxSizing = 'border-box';
            const newWidth = getHorizontalDistance(rect, event.pageX, !isRTL) / zoomScale;
            newWidthList.set(td, newWidth);
        }
    });
    newWidthList.forEach((newWidth, td) => {
        td.style.width = `${newWidth}px`;
    });
    if (!isShiftPressed) {
        nextCells.forEach(td => {
            const width = td.rowSpan > 1 ? 0 : td.getBoundingClientRect().right - initialX;
            td.style.wordBreak = 'break-word';
            td.style.whiteSpace = 'normal';
            td.style.boxSizing = 'border-box';
            td.style.width = td.rowSpan > 1 ? '' : width / zoomScale - deltaX + 'px';
        });
    }

    // To avoid apply format styles when the table is being resizing, the skipApplyFormat is set to true.
    vTable.writeBack(true /**skipApplyFormat*/);
    return true;
}

function getHorizontalDistance(rect: Rect, pos: number, toLeft: boolean): number {
    return toLeft ? pos - rect.left : rect.right - pos;
}

function setHorizontalPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { td } = context;
    const rect = normalizeRect(td.getBoundingClientRect());
    if (rect) {
        trigger.style.top = rect.bottom - CELL_RESIZER_WIDTH + 'px';
        trigger.style.left = rect.left + 'px';
        trigger.style.width = rect.right - rect.left + 'px';
        trigger.style.height = CELL_RESIZER_WIDTH + 'px';
    }
}

function setVerticalPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { td, isRTL } = context;
    const rect = normalizeRect(td.getBoundingClientRect());
    if (rect) {
        trigger.style.top = rect.top + 'px';
        trigger.style.left = (isRTL ? rect.left : rect.right) - CELL_RESIZER_WIDTH + 1 + 'px';
        trigger.style.width = CELL_RESIZER_WIDTH + 'px';
        trigger.style.height = rect.bottom - rect.top + 'px';
    }
}

/**
 *
 * @param newPos The position to where we want to move the vertical border
 * @returns if the move is allowed, or, if any of the cells on either side of the vertical border is smaller than
 * the minimum width, such move is not allowed
 */
function canResizeColumns(
    newPos: number,
    currentCells: HTMLTableCellElement[],
    nextCells: HTMLTableCellElement[],
    isRTL: boolean,
    zoomScale: number
) {
    for (let i = 0; i < currentCells.length; i++) {
        const td = currentCells[i];
        const rect = normalizeRect(td.getBoundingClientRect());
        if (rect) {
            const width = getHorizontalDistance(rect, newPos, !isRTL) / zoomScale;
            if (width < MIN_CELL_WIDTH) {
                return false;
            }
        }
    }

    for (let i = 0; i < nextCells.length; i++) {
        const td = nextCells[i];
        let width: number = Number.MAX_SAFE_INTEGER;
        if (td) {
            const rect = normalizeRect(td.getBoundingClientRect());

            if (rect) {
                width = getHorizontalDistance(rect, newPos, isRTL) / zoomScale;
            }
        }

        if (width < MIN_CELL_WIDTH) {
            return false;
        }
    }

    return true;
}
