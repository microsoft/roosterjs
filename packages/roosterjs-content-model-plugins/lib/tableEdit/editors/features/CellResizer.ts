import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { getCMTableFromTable } from '../utils/getTableFromContentModel';
import type { TableEditFeature } from './TableEditFeature';
import {
    normalizeRect,
    MIN_ALLOWED_TABLE_CELL_WIDTH,
    mutateBlock,
    MIN_ALLOWED_TABLE_CELL_HEIGHT,
    parseValueWithUnit,
} from 'roosterjs-content-model-dom';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { IEditor, ReadonlyContentModelTable } from 'roosterjs-content-model-types';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';

const CELL_RESIZER_WIDTH = 4;
/**
 * @internal
 */
export const HORIZONTAL_RESIZER_ID = 'horizontalResizer';
/**
 * @internal
 */
export const VERTICAL_RESIZER_ID = 'verticalResizer';

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
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const document = td.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: `position: fixed; cursor: ${isHorizontal ? 'row' : 'col'}-resize; user-select: none`,
    };
    const zoomScale = editor.getDOMHelper().calculateZoomScale();

    const div = createElement(createElementData, document) as HTMLDivElement;

    (anchorContainer || document.body).appendChild(div);

    const context: CellResizerContext = {
        editor,
        td,
        table,
        isRTL,
        zoomScale,
        onStart,
        originalWidth: parseValueWithUnit(table.style.width),
    };
    const setPosition = isHorizontal ? setHorizontalPosition : setVerticalPosition;
    setPosition(context, div);

    const handler: DragAndDropHandler<CellResizerContext, CellResizerInitValue> = {
        onDragStart,
        // Horizontal modifies row height, vertical modifies column width
        onDragging: isHorizontal ? onDraggingHorizontal : onDraggingVertical,
        onDragEnd: onEnd,
    };

    const featureHandler = new CellResizer(
        div,
        context,
        setPosition,
        handler,
        zoomScale,
        editor.getEnvironment().isMobileOrTablet,
        onTableEditorCreated
    );

    return { node: td, div, featureHandler };
}

class CellResizer extends DragAndDropHelper<CellResizerContext, CellResizerInitValue> {
    private disposer: undefined | (() => void);

    constructor(
        trigger: HTMLElement,
        context: CellResizerContext,
        onSubmit: (context: CellResizerContext, trigger: HTMLElement) => void,
        handler: DragAndDropHandler<CellResizerContext, CellResizerInitValue>,
        zoomScale: number,
        forceMobile?: boolean,
        onTableEditorCreated?: OnTableEditorCreatedCallback
    ) {
        super(trigger, context, onSubmit, handler, zoomScale, forceMobile);
        this.disposer = onTableEditorCreated?.('CellResizer', trigger);
    }

    dispose(): void {
        this.disposer?.();
        this.disposer = undefined;
        super.dispose();
    }
}

/**
 * @internal
 * Exported for testing
 */
export interface CellResizerContext {
    editor: IEditor;
    td: HTMLTableCellElement;
    table: HTMLTableElement;
    isRTL: boolean;
    zoomScale: number;
    originalWidth: number;
    onStart: () => void;
}

/**
 * @internal
 * Exported for testing
 */
export interface CellResizerInitValue {
    cmTable: ReadonlyContentModelTable | undefined;
    anchorColumn: number | undefined;
    nextColumn: number;
    anchorRow: number | undefined;
    anchorRowHeight: number;
    allWidths: number[];
}

/**
 * @internal
 * Exported for testing
 */
export function onDragStart(context: CellResizerContext, event: MouseEvent): CellResizerInitValue {
    const { td, onStart } = context;
    const rect = normalizeRect(td.getBoundingClientRect());

    // Get cell coordinates
    let rowIndex: number | undefined;
    let columnIndex: number | undefined;
    let nextColumnIndex = -1;

    const { editor, table } = context;

    // Get Table block in content model
    const cmTable = getCMTableFromTable(editor, table);

    if (rect && cmTable) {
        for (let r = 0; r < cmTable?.rows.length; r++) {
            for (let c = 0; c < cmTable.rows[r].cells.length; c++) {
                const cell = cmTable.rows[r].cells[c];

                if (cell.cachedElement == td) {
                    rowIndex = r;
                    columnIndex = c;
                } else if (rowIndex != undefined && columnIndex != undefined) {
                    if (!cell.cachedElement) {
                        columnIndex = c;
                    } else {
                        nextColumnIndex = c;
                        break;
                    }
                }
            }

            if (rowIndex != undefined) {
                break;
            }
        }

        onStart();

        if (rowIndex !== undefined) {
            return {
                cmTable,
                anchorColumn: columnIndex,
                nextColumn: nextColumnIndex,
                anchorRow: rowIndex,
                anchorRowHeight: cmTable.rows[rowIndex].height,
                allWidths: [...cmTable.widths],
            };
        }
    }

    return {
        cmTable,
        anchorColumn: undefined,
        anchorRow: undefined,
        anchorRowHeight: -1,
        allWidths: [],
        nextColumn: -1,
    }; // Just a fallback
}

/**
 * @internal
 * Exported for testing
 */
export function onDraggingHorizontal(
    context: CellResizerContext,
    event: MouseEvent,
    initValue: CellResizerInitValue,
    deltaX: number,
    deltaY: number
) {
    const { cmTable, anchorRow, anchorRowHeight } = initValue;

    // Assign new widths and heights to the CM table
    if (cmTable && anchorRow != undefined && cmTable.rows[anchorRow] != undefined) {
        // Modify the CM Table size
        mutateBlock(cmTable).rows[anchorRow].height = (anchorRowHeight ?? 0) + deltaY;

        // Normalize the new height value
        const newHeight = Math.max(cmTable.rows[anchorRow].height, MIN_ALLOWED_TABLE_CELL_HEIGHT);

        // Writeback CM Table size changes to DOM Table
        const tableRow = cmTable.rows[anchorRow].cells;

        for (let col = 0; col < tableRow.length; col++) {
            const td = tableRow[col].cachedElement;

            if (td) {
                td.style.height = newHeight + 'px';
                td.style.boxSizing = 'border-box';
            }
        }

        return true;
    } else {
        return false;
    }
}

/**
 * @internal
 * Exported for testing
 */
export function onDraggingVertical(
    context: CellResizerContext,
    event: MouseEvent,
    initValue: CellResizerInitValue,
    deltaX: number
) {
    const { table, isRTL } = context;
    const { cmTable, anchorColumn, nextColumn, allWidths } = initValue;

    // Assign new widths and heights to the CM table
    if (cmTable && anchorColumn != undefined) {
        const mutableTable = mutateBlock(cmTable);

        const change = deltaX * (isRTL ? -1 : 1);
        // This is the last column
        if (nextColumn == -1) {
            // Only the last column changes
            // Normalize the new width value
            const newWidth = Math.max(
                allWidths[anchorColumn] + change,
                MIN_ALLOWED_TABLE_CELL_WIDTH
            );
            mutableTable.widths[anchorColumn] = newWidth;
        } else {
            // Any other two columns
            const anchorChange = allWidths[anchorColumn] + change;
            const nextAnchorChange = allWidths[nextColumn] - change;
            if (
                anchorChange < MIN_ALLOWED_TABLE_CELL_WIDTH ||
                nextAnchorChange < MIN_ALLOWED_TABLE_CELL_WIDTH
            ) {
                return false;
            }

            mutableTable.widths[anchorColumn] = anchorChange;
            mutableTable.widths[nextColumn] = nextAnchorChange;
        }

        // Write back CM Table size changes to DOM Table
        for (let row = 0; row < cmTable.rows.length; row++) {
            const tableRow = cmTable.rows[row].cells;
            let lastTd: HTMLTableCellElement | null = null;
            let lastWidth = 0;

            for (let col = 0; col < tableRow.length; col++) {
                const td = tableRow[col].cachedElement;

                if (td) {
                    td.style.boxSizing = 'border-box';
                    lastTd = td;
                    lastWidth = cmTable.widths[col];
                } else if (lastTd && tableRow[col].spanLeft) {
                    lastWidth += cmTable.widths[col];
                } else {
                    lastTd = null;
                    lastWidth = 0;
                }

                if (lastTd) {
                    lastTd.style.width = lastWidth + 'px';
                }
            }
        }

        if (context.originalWidth > 0) {
            const newWidth = context.originalWidth + change + 'px';

            mutableTable.format.width = newWidth;
            table.style.width = newWidth;
        }

        return true;
    } else {
        return false;
    }
}

function setHorizontalPosition(context: CellResizerContext, trigger: HTMLElement) {
    const { td } = context;
    const rect = normalizeRect(td.getBoundingClientRect());
    if (rect) {
        trigger.id = HORIZONTAL_RESIZER_ID;
        trigger.style.top = rect.bottom - CELL_RESIZER_WIDTH + 'px';
        trigger.style.left = rect.left + 'px';
        trigger.style.width = rect.right - rect.left + 'px';
        trigger.style.height = CELL_RESIZER_WIDTH + 'px';
    }
}

function setVerticalPosition(context: CellResizerContext, trigger: HTMLElement) {
    const { td, isRTL } = context;
    const rect = normalizeRect(td.getBoundingClientRect());
    if (rect) {
        trigger.id = VERTICAL_RESIZER_ID;
        trigger.style.top = rect.top + 'px';
        trigger.style.left = (isRTL ? rect.left : rect.right) - CELL_RESIZER_WIDTH + 1 + 'px';
        trigger.style.width = CELL_RESIZER_WIDTH + 'px';
        trigger.style.height = rect.bottom - rect.top + 'px';
    }
}
