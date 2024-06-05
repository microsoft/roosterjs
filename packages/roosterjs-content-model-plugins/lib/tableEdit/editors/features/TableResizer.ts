import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { getCMTableFromTable } from '../utils/getTableFromContentModel';
import {
    MIN_ALLOWED_TABLE_CELL_HEIGHT,
    isNodeOfType,
    mutateBlock,
    normalizeRect,
} from 'roosterjs-content-model-dom';
import type { TableEditFeature } from './TableEditFeature';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import type { IEditor, ReadonlyContentModelTable, Rect } from 'roosterjs-content-model-types';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';

const TABLE_RESIZER_LENGTH = 12;
/**
 * @internal
 */
export const TABLE_RESIZER_ID = '_Table_Resizer';

/**
 * @internal
 */
export function createTableResizer(
    table: HTMLTableElement,
    editor: IEditor,
    isRTL: boolean,
    onStart: () => void,
    onEnd: () => false,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableBottomVisible(editor, rect, contentDiv as Node)) {
        return null;
    }

    const document = table.ownerDocument;
    const zoomScale = editor.getDOMHelper().calculateZoomScale();
    const createElementData = {
        tag: 'div',
        style: `position: fixed; cursor: ${
            isRTL ? 'ne' : 'nw'
        }-resize; user-select: none; border: 1px solid #808080`,
    };

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_RESIZER_ID;
    div.style.width = `${TABLE_RESIZER_LENGTH}px`;
    div.style.height = `${TABLE_RESIZER_LENGTH}px`;

    (anchorContainer || document.body).appendChild(div);

    const context: TableResizerContext = {
        isRTL,
        table,
        zoomScale,
        onStart,
        onEnd,
        div,
        editor,
        contentDiv,
    };

    setDivPosition(context, div);

    const featureHandler = new TableResizer(
        div,
        context,
        hideResizer, // Resizer is hidden while dragging only
        {
            onDragStart,
            onDragging,
            onDragEnd,
        },
        zoomScale,
        editor.getEnvironment().isMobileOrTablet,
        onTableEditorCreated
    );

    return { node: table, div, featureHandler };
}

class TableResizer extends DragAndDropHelper<TableResizerContext, TableResizerInitValue> {
    private disposer: undefined | (() => void);

    constructor(
        trigger: HTMLElement,
        context: TableResizerContext,
        onSubmit: (context: TableResizerContext, trigger: HTMLElement) => void,
        handler: DragAndDropHandler<TableResizerContext, TableResizerInitValue>,
        zoomScale: number,
        forceMobile?: boolean,
        onTableEditorCreated?: OnTableEditorCreatedCallback
    ) {
        super(trigger, context, onSubmit, handler, zoomScale, forceMobile);
        this.disposer = onTableEditorCreated?.('TableResizer', trigger);
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
export interface TableResizerContext {
    table: HTMLTableElement;
    isRTL: boolean;
    zoomScale: number;
    onStart: () => void;
    onEnd: () => false;
    div: HTMLDivElement;
    editor: IEditor;
    contentDiv?: EventTarget | null;
}

/**
 * @internal
 * Exported for testing
 */
export interface TableResizerInitValue {
    originalRect: DOMRect;
    originalHeights: number[];
    originalWidths: number[];
    cmTable: ReadonlyContentModelTable | undefined;
}

/**
 * @internal
 * Exported for testing
 */
export function onDragStart(
    context: TableResizerContext,
    event: MouseEvent
): TableResizerInitValue {
    context.onStart();

    const { editor, table } = context;

    // Get Table block in content model
    const cmTable = getCMTableFromTable(editor, table);

    // Save original widths and heights
    const heights: number[] = [];
    cmTable?.rows.forEach(row => {
        heights.push(row.height);
    });
    const widths: number[] = [];
    cmTable?.widths.forEach(width => {
        widths.push(width);
    });

    return {
        originalRect: table.getBoundingClientRect(),
        cmTable,
        originalHeights: heights ?? [],
        originalWidths: widths ?? [],
    };
}

/**
 * @internal
 * Exported for testing
 */
export function onDragging(
    context: TableResizerContext,
    event: MouseEvent,
    initValue: TableResizerInitValue,
    deltaX: number,
    deltaY: number
) {
    const { isRTL, zoomScale, table } = context;
    const { originalRect, originalHeights, originalWidths, cmTable } = initValue;

    const ratioX = 1.0 + (deltaX / originalRect.width) * zoomScale * (isRTL ? -1 : 1);
    const ratioY = 1.0 + (deltaY / originalRect.height) * zoomScale;
    const shouldResizeX = Math.abs(ratioX - 1.0) > 1e-3;
    const shouldResizeY = Math.abs(ratioY - 1.0) > 1e-3;

    // If the width of some external table is fixed, we need to make it resizable
    table.style.setProperty('width', null);
    // If the height of some external table is fixed, we need to make it resizable
    table.style.setProperty('height', null);

    // Assign new widths and heights to the CM table
    if (cmTable && cmTable.rows && (shouldResizeX || shouldResizeY)) {
        const mutableTable = mutateBlock(cmTable);

        // Modify the CM Table size
        for (let i = 0; i < cmTable.rows.length; i++) {
            for (let j = 0; j < cmTable.rows[i].cells.length; j++) {
                const cell = cmTable.rows[i].cells[j];
                if (cell) {
                    if (shouldResizeX && i == 0) {
                        mutableTable.widths[j] = (originalWidths[j] ?? 0) * ratioX;
                    }
                    if (shouldResizeY && j == 0) {
                        mutableTable.rows[i].height = (originalHeights[i] ?? 0) * ratioY;
                    }
                }
            }
        }

        // Writeback CM Table size changes to DOM Table
        for (let row = 0; row < table.rows.length; row++) {
            const tableRow = table.rows[row];

            if (tableRow.cells.length == 0) {
                // Skip empty row
                continue;
            }

            // Normalize the new height value
            const newHeight = Math.max(cmTable.rows[row].height, MIN_ALLOWED_TABLE_CELL_HEIGHT);

            for (let col = 0; col < tableRow.cells.length; col++) {
                const td = tableRow.cells[col];

                // Normalize the new width value
                const newWidth = Math.max(cmTable.widths[col], MIN_ALLOWED_TABLE_CELL_HEIGHT);

                td.style.width = newWidth + 'px';
                td.style.height = newHeight + 'px';
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
export function onDragEnd(
    context: TableResizerContext,
    event: MouseEvent,
    initValue: TableResizerInitValue | undefined
) {
    if (context.editor.isDisposed()) {
        return false;
    }
    if (
        isTableBottomVisible(
            context.editor,
            normalizeRect(context.table.getBoundingClientRect()),
            context.contentDiv as Node
        )
    ) {
        context.div.style.visibility = 'visible';
        setDivPosition(context, context.div);
    }
    context.onEnd();
    return false;
}

function setDivPosition(context: TableResizerContext, trigger: HTMLElement) {
    const { table, isRTL } = context;
    const rect = normalizeRect(table.getBoundingClientRect());

    if (rect) {
        trigger.style.top = `${rect.bottom}px`;
        trigger.style.left = isRTL
            ? `${rect.left - TABLE_RESIZER_LENGTH - 2}px`
            : `${rect.right}px`;
    }
}

function hideResizer(context: TableResizerContext, trigger: HTMLElement) {
    trigger.style.visibility = 'hidden';
}

function isTableBottomVisible(
    editor: IEditor,
    rect: Rect | null,
    contentDiv?: Node | null
): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (isNodeOfType(contentDiv, 'ELEMENT_NODE') && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return (
            !!containerRect &&
            containerRect.bottom >= rect.bottom &&
            visibleViewport.bottom >= rect.bottom
        );
    }

    return true;
}
