import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { normalizeRect, parseTableCells } from 'roosterjs-content-model-dom';
import type { CreateElementData } from '../../../pluginUtils/CreateElement/CreateElementData';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { Disposable } from '../../../pluginUtils/Disposable';
import type { TableEditFeature } from './TableEditFeature';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import type {
    DOMSelection,
    IEditor,
    ParsedTable,
    ReadonlyContentModelTable,
    Rect,
    TableSelection,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const ROW_SELECTOR_ID = 'rowSelector';
/**
 * @internal
 */
export const COLUMN_SELECTOR_ID = 'columnSelector';

const STABLE_DOWN_ARROW_CURSOR =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48dGV4dCB4PSI4IiB5PSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iYmxhY2siPiYjMTI5MDk1OzwvdGV4dD48L3N2Zz4=';

const STABLE_RIGHT_ARROW_CURSOR =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48dGV4dCB4PSI4IiB5PSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iYmxhY2siIHRyYW5zZm9ybT0icm90YXRlKC05MCA4IDgpIj4mIzEyOTA5NTs8L3RleHQ+PC9zdmc+';

/**
 * @internal
 */
export function createTableRowColumnSelector(
    editor: IEditor,
    table: HTMLTableElement,
    isRowSelector: boolean,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());
    if (rect) {
        const zoomScale = editor.getDOMHelper().calculateZoomScale();
        const createElementData = getInsertElementData(rect, isRowSelector);
        const div = createElement(createElementData, document) as HTMLDivElement;
        div.id = isRowSelector ? ROW_SELECTOR_ID : COLUMN_SELECTOR_ID;
        const context: TableRowColumnSelectorContext = {
            table,
            zoomScale,
            editor,
            div,

            isRow: isRowSelector,
        };

        (anchorContainer || document.body).appendChild(div);
        const handler = new TableSelectorHandler(
            div,
            isRowSelector,
            context,
            {
                onDragStart,
                onDragging,
                onDragEnd,
            },
            context.zoomScale,
            onTableEditorCreated,
            editor.getEnvironment().isMobileOrTablet
        );
        return { div, featureHandler: handler, node: table };
    }

    return null;
}

/**
 * @internal
 * Exported for testing
 */
export interface TableRowColumnSelectorContext {
    table: HTMLTableElement;
    zoomScale: number;
    editor: IEditor;
    div: HTMLElement;
    isRow: boolean;
}

/**
 *  @internal
 */
export interface TableRowColumnSelectorInitValue {
    cmTable: ReadonlyContentModelTable | undefined;
    initialSelection: DOMSelection | null;
    parsedTable: ParsedTable;
    startIndex: number;
}
/**
 *  @internal
 */
export class TableSelectorHandler
    extends DragAndDropHelper<TableRowColumnSelectorContext, TableRowColumnSelectorInitValue>
    implements Disposable {
    private disposer: undefined | (() => void);
    constructor(
        div: HTMLDivElement,
        private isRow: boolean,
        context: TableRowColumnSelectorContext,
        handler: DragAndDropHandler<TableRowColumnSelectorContext, TableRowColumnSelectorInitValue>,
        zoomScale: number,
        onTableEditorCreated?: OnTableEditorCreatedCallback,
        forceMobile?: boolean | undefined
    ) {
        super(div, context, () => {}, handler, zoomScale, forceMobile);
        this.disposer = onTableEditorCreated?.(
            this.isRow ? 'TableRowSelector' : 'TableColumnSelector',
            div
        );
    }

    dispose() {
        this.disposer?.();
        this.disposer = undefined;
    }
}

/**
 * @internal
 * Helper function to calculate current row/column index from mouse coordinates during drag
 */
function getCurrentIndexFromMouse(
    table: HTMLTableElement,
    x: number,
    y: number,
    isRow: boolean
): number {
    if (isRow) {
        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];

            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                const cellRect = normalizeRect(cell.getBoundingClientRect());
                if (cellRect && y >= cellRect.top && y <= cellRect.bottom) {
                    return i;
                }
            }
        }
        return Math.max(0, table.rows.length - 1);
    } else {
        if (!table.rows[0]) {
            return 0;
        }
        const firstRow = table.rows[0];
        for (let i = 0; i < firstRow.cells.length; i++) {
            const cell = firstRow.cells[i];
            const cellRect = normalizeRect(cell.getBoundingClientRect());
            if (cellRect && x >= cellRect.left && x <= cellRect.right) {
                return i;
            }
        }
        return firstRow.cells.length - 1;
    }
}

/**
 * @internal
 * Exported for testing
 */
export function onDragStart(
    context: TableRowColumnSelectorContext,
    event: MouseEvent
): TableRowColumnSelectorInitValue {
    const { table, editor, isRow } = context;
    editor.setDOMSelection(null);

    const parsedTable = parseTableCells(table);

    const startIndex = getCurrentIndexFromMouse(table, event.clientX, event.clientY, isRow);

    if (isRow) {
        const columnNumber = parsedTable[startIndex].length - 1;
        const initialSelection: TableSelection = {
            type: 'table',
            table,
            firstRow: startIndex,
            lastRow: startIndex,
            firstColumn: 0,
            lastColumn: columnNumber,
        };

        return {
            cmTable: undefined,
            initialSelection,

            parsedTable,
            startIndex,
        };
    } else {
        const rowNumber = parsedTable.length - 1;
        const initialSelection: TableSelection = {
            type: 'table',
            table,
            firstRow: 0,
            lastRow: rowNumber,
            firstColumn: startIndex,
            lastColumn: startIndex,
        };

        return {
            cmTable: undefined,
            initialSelection,

            parsedTable,
            startIndex,
        };
    }
}

/**
 * @internal
 * Exported for testing
 */
export function onDragging(
    context: TableRowColumnSelectorContext,
    event: MouseEvent,
    initValue: TableRowColumnSelectorInitValue | undefined
): boolean {
    if (!initValue) {
        return false;
    }

    const { table, editor, isRow } = context;
    const { parsedTable, startIndex } = initValue;

    const currentIndex = getCurrentIndexFromMouse(table, event.clientX, event.clientY, isRow);

    if (isRow) {
        const columnNumber = parsedTable[startIndex].length - 1;
        const firstRow = Math.min(startIndex, currentIndex);
        const lastRow = Math.max(startIndex, currentIndex);

        editor.setDOMSelection({
            type: 'table',
            table: table,
            firstRow,
            firstColumn: 0,
            lastRow,
            lastColumn: columnNumber,
        });
    } else {
        const firstColumn = Math.min(startIndex, currentIndex);
        const lastColumn = Math.max(startIndex, currentIndex);
        const rowNumber = parsedTable.length - 1;

        editor.setDOMSelection({
            type: 'table',
            table: table,
            firstRow: 0,
            firstColumn,
            lastColumn,
            lastRow: rowNumber,
        });
    }

    return true;
}

/**
 * @internal
 * Exported for testing
 */
export function onDragEnd(
    context: TableRowColumnSelectorContext,
    event: MouseEvent,
    initValue: TableRowColumnSelectorInitValue | undefined
): boolean {
    if (!initValue) {
        return false;
    }

    const { editor } = context;
    const selection = editor.getDOMSelection();

    if (selection?.type !== 'table') {
        editor.setDOMSelection(initValue.initialSelection);
    }

    return true;
}

function getInsertElementData(rect: Rect, isRowSelector: boolean): CreateElementData {
    const length = isRowSelector ? rect.bottom - rect.top : rect.right - rect.left;
    const size = isRowSelector
        ? `width: 16px; height: ${length}px; top: ${rect.top}px; left: ${rect.left - 16}px`
        : `width: ${length - 5}px; height: 16px; top: ${rect.top - 16}px; left: ${rect.left}px`;

    const cursor = isRowSelector
        ? `url("${STABLE_RIGHT_ARROW_CURSOR}"), auto`
        : `url("${STABLE_DOWN_ARROW_CURSOR}") , auto`;

    const outerDivStyle = `position: fixed; ${size}; background-color: transparent; cursor: ${cursor}; pointer-events: auto; z-index: 1000;`;
    return {
        tag: 'div',
        style: outerDivStyle,
    };
}
