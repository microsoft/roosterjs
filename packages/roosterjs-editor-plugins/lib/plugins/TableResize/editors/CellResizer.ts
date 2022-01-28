import DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import TableEditFeature from './TableEditorFeature';
import { createElement, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { KnownCreateElementDataIndex, Rect, SizeTransformer } from 'roosterjs-editor-types';

const CELL_RESIZER_WIDTH = 4;
const MIN_CELL_WIDTH = 30;

/**
 * @internal
 */
export default function createCellResizer(
    td: HTMLTableCellElement,
    sizeTransformer: SizeTransformer,
    isRTL: boolean,
    isHorizontal: boolean,
    onStart: () => void,
    onEnd: () => false
): TableEditFeature {
    const document = td.ownerDocument;
    const div = createElement(
        isHorizontal
            ? KnownCreateElementDataIndex.TableHorizontalResizer
            : KnownCreateElementDataIndex.TableVerticalResizer,
        document
    ) as HTMLDivElement;

    document.body.appendChild(div);

    const context: DragAndDropContext = { td, isRTL, sizeTransformer, onStart };
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
        sizeTransformer
    );

    return { node: td, div, featureHandler };
}

interface DragAndDropContext {
    td: HTMLTableCellElement;
    isRTL: boolean;
    sizeTransformer: SizeTransformer;
    onStart: () => void;
}

interface DragAndDropInitValue {
    vTable: VTable;
    currentCells: HTMLTableCellElement[];
    nextCells: HTMLTableCellElement[];
}

function onDragStart(context: DragAndDropContext, event: MouseEvent) {
    const { td, isRTL, sizeTransformer, onStart } = context;
    const vTable = new VTable(td, true /*normalizeSize*/, sizeTransformer);
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
        };
    } else {
        return { vTable, currentCells: [], nextCells: [] }; // Just a fallback
    }
}

function onDraggingHorizontal(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { td, sizeTransformer } = context;
    const { vTable } = initValue;

    vTable.table.removeAttribute('height');
    vTable.table.style.height = null;
    vTable.forEachCellOfCurrentRow(cell => {
        if (cell.td) {
            cell.td.style.height =
                cell.td == td ? `${sizeTransformer(cell.height) + deltaY}px` : null;
        }
    });

    vTable.writeBack();
    return true;
}

function onDraggingVertical(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { isRTL, sizeTransformer } = context;
    const { vTable, nextCells, currentCells } = initValue;

    if (!canResizeColumns(event.pageX, currentCells, nextCells, isRTL, sizeTransformer)) {
        return false;
    }

    // Since we allow the user to resize the table width on adjusting the border of the last cell,
    // we need to make the table width resizable by setting it as null;
    // We also allow the user to resize the table width if Shift key is pressed
    const isLastCell = nextCells.length == 0;
    const isShiftPressed = event.shiftKey;

    if (isLastCell || isShiftPressed) {
        vTable.table.style.width = null;
    }

    const newWidthList = new Map<HTMLTableCellElement, number>();
    currentCells.forEach(td => {
        const rect = normalizeRect(td.getBoundingClientRect());

        if (rect) {
            td.style.wordBreak = 'break-word';
            td.style.whiteSpace = 'normal';
            td.style.boxSizing = 'border-box';
            const newWidth = sizeTransformer(getHorizontalDistance(rect, event.pageX, !isRTL));
            newWidthList.set(td, newWidth);
        }
    });
    newWidthList.forEach((newWidth, td) => {
        td.style.width = `${newWidth}px`;
    });
    if (!isShiftPressed) {
        nextCells.forEach(td => {
            td.style.wordBreak = 'break-word';
            td.style.whiteSpace = 'normal';
            td.style.boxSizing = 'border-box';
            td.style.width = null;
        });
    }

    vTable.writeBack();
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
    sizeTransformer: SizeTransformer
) {
    for (let i = 0; i < currentCells.length; i++) {
        const td = currentCells[i];
        const rect = normalizeRect(td.getBoundingClientRect());
        if (rect) {
            const width = sizeTransformer(getHorizontalDistance(rect, newPos, !isRTL));
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
                width = sizeTransformer(getHorizontalDistance(rect, newPos, isRTL));
            }
        }

        if (width < MIN_CELL_WIDTH) {
            return false;
        }
    }

    return true;
}
