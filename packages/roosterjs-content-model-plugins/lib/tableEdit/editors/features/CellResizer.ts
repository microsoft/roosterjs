import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { isElementOfType } from 'roosterjs-content-model-dom';
import { normalizeRect } from '../../../pluginUtils/Rect/normalizeRect';
import {
    getFirstSelectedTable,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
    normalizeTable,
} from 'roosterjs-content-model-core';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { ContentModelTable, IEditor } from 'roosterjs-content-model-types';
import type { TableEditFeature } from './TableEditFeature';

const CELL_RESIZER_WIDTH = 4;

/**
 * @internal
 */
export function createCellResizer(
    editor: IEditor,
    td: HTMLTableCellElement,
    table: HTMLTableElement,
    isRTL: boolean,
    isHorizontal: boolean,
    onStart: () => void,
    onEnd: () => false,
    anchorContainer?: HTMLElement
): TableEditFeature | null {
    const document = td.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: `position: fixed; cursor: ${isHorizontal ? 'row' : 'col'}-resize; user-select: none`,
    };
    const zoomScale = editor.getDOMHelper().calculateZoomScale();

    const div = createElement(createElementData, document) as HTMLDivElement;

    (anchorContainer || document.body).appendChild(div);

    const context: DragAndDropContext = { editor, td, table, isRTL, zoomScale, onStart };
    const setPosition = isHorizontal ? setHorizontalPosition : setVerticalPosition;
    setPosition(context, div);

    const handler: DragAndDropHandler<DragAndDropContext, DragAndDropInitValue> = {
        onDragStart,
        // Horizontal modifies row height, vertical modifies column width
        onDragging: isHorizontal ? onDraggingHorizontal : onDraggingVertical,
        onDragEnd: onEnd,
    };

    const featureHandler = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
        div,
        context,
        setPosition,
        handler,
        zoomScale,
        editor.getEnvironment().isMobileOrTablet
    );

    return { node: td, div, featureHandler };
}

interface DragAndDropContext {
    editor: IEditor;
    td: HTMLTableCellElement;
    table: HTMLTableElement;
    isRTL: boolean;
    zoomScale: number;
    onStart: () => void;
}

interface DragAndDropInitValue {
    cmTable: ContentModelTable | undefined;
    anchorColumn: number | undefined;
    anchorRow: number | undefined;
    anchorRowHeight: number;
    allWidths: number[];
}

function onDragStart(context: DragAndDropContext, event: MouseEvent): DragAndDropInitValue {
    const { td, onStart } = context;
    const rect = normalizeRect(td.getBoundingClientRect());

    // Get cell coordinates
    const columnIndex = td.cellIndex;
    const row =
        td.parentElement && isElementOfType(td.parentElement, 'tr') ? td.parentElement : undefined;
    const rowIndex = row?.rowIndex;

    if (rowIndex == undefined) {
        return {
            cmTable: undefined,
            anchorColumn: undefined,
            anchorRow: undefined,
            anchorRowHeight: -1,
            allWidths: [],
        }; // Just a fallback
    }

    const { editor, table } = context;

    // Get current selection
    const selection = editor.getDOMSelection();

    // Select first cell of the table
    editor.setDOMSelection({
        type: 'table',
        firstColumn: 0,
        firstRow: 0,
        lastColumn: 0,
        lastRow: 0,
        table: table,
    });

    // Get the table content model
    const cmTable = getFirstSelectedTable(editor.getContentModelCopy('disconnected'))[0];

    // Restore selection
    editor.setDOMSelection(selection);

    if (rect && cmTable) {
        onStart();

        return {
            cmTable,
            anchorColumn: columnIndex,
            anchorRow: rowIndex,
            anchorRowHeight: cmTable.rows[rowIndex].height,
            allWidths: [...cmTable.widths],
        };
    } else {
        return {
            cmTable,
            anchorColumn: undefined,
            anchorRow: undefined,
            anchorRowHeight: -1,
            allWidths: [],
        }; // Just a fallback
    }
}

function onDraggingHorizontal(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { table } = context;
    const { cmTable, anchorRow, anchorRowHeight } = initValue;

    // Assign new widths and heights to the CM table
    if (cmTable && anchorRow != undefined) {
        // Modify the CM Table size
        cmTable.rows[anchorRow].height = (anchorRowHeight ?? 0) + deltaY;

        // Normalize the table
        normalizeTable(cmTable);

        // Writeback CM Table size changes to DOM Table
        const tableRow = table.rows[anchorRow];
        for (let col = 0; col < tableRow.cells.length; col++) {
            const td = tableRow.cells[col];
            td.style.height = cmTable.rows[anchorRow].height + 'px';
        }

        return true;
    } else {
        return false;
    }
}

function onDraggingVertical(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number
) {
    const { table, isRTL } = context;
    const { cmTable, anchorColumn, allWidths } = initValue;

    // Assign new widths and heights to the CM table
    if (cmTable && anchorColumn != undefined) {
        // Modify the CM Table size
        const lastColumn = anchorColumn == cmTable.widths.length - 1;
        const change = deltaX * (isRTL ? -1 : 1);
        // This is the last column
        if (lastColumn) {
            // Only the last column changes
            cmTable.widths[anchorColumn] = allWidths[anchorColumn] + change;
        } else {
            // Any other two columns
            const anchorChange = allWidths[anchorColumn] + change;
            const nextAnchorChange = allWidths[anchorColumn + 1] - change;
            if (
                anchorChange < MIN_ALLOWED_TABLE_CELL_WIDTH ||
                nextAnchorChange < MIN_ALLOWED_TABLE_CELL_WIDTH
            ) {
                return false;
            }
            cmTable.widths[anchorColumn] = anchorChange;
            cmTable.widths[anchorColumn + 1] = nextAnchorChange;
        }

        // Normalize the table
        normalizeTable(cmTable);

        // Writeback CM Table size changes to DOM Table
        for (let row = 0; row < table.rows.length; row++) {
            const tableRow = table.rows[row];
            for (let col = 0; col < tableRow.cells.length; col++) {
                tableRow.cells[col].style.width = cmTable.widths[col] + 'px';
            }
        }

        return true;
    } else {
        return false;
    }
}

function setHorizontalPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { td } = context;
    const rect = normalizeRect(td.getBoundingClientRect());
    if (rect) {
        trigger.id = 'horizontalResizer';
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
        trigger.id = 'verticalResizer';
        trigger.style.top = rect.top + 'px';
        trigger.style.left = (isRTL ? rect.left : rect.right) - CELL_RESIZER_WIDTH + 1 + 'px';
        trigger.style.width = CELL_RESIZER_WIDTH + 'px';
        trigger.style.height = rect.bottom - rect.top + 'px';
    }
}
