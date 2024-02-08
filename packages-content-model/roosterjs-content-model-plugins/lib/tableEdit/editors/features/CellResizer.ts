import createElement from '../../../pluginUtils/CreateElement/createElement';
import DragAndDropHelper from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import normalizeRect from '../../../pluginUtils/Rect/normalizeRect';
import { getFirstSelectedTable, normalizeTable } from 'roosterjs-content-model-core';
import type DragAndDropHandler from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { ContentModelTable, IStandaloneEditor } from 'roosterjs-content-model-types';
import type TableEditFeature from './TableEditorFeature';

const CELL_RESIZER_WIDTH = 4;

/**
 * @internal
 */
export default function createCellResizer(
    editor: IStandaloneEditor,
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
    editor: IStandaloneEditor;
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
    initialX: number;
    allWidths: number[];
}

function onDragStart(context: DragAndDropContext, event: MouseEvent): DragAndDropInitValue {
    const { td, onStart } = context;
    const rect = normalizeRect(td.getBoundingClientRect());

    // Get cell coordinates
    const columnIndex = td.cellIndex;
    const row = td.parentElement instanceof HTMLTableRowElement ? td.parentElement : undefined;
    const rowIndex = row?.rowIndex;

    if (rowIndex == undefined) {
        return {
            cmTable: undefined,
            anchorColumn: undefined,
            anchorRow: undefined,
            initialX: 0,
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
            initialX: cmTable.widths[columnIndex],
            allWidths: event.shiftKey ? [...cmTable.widths] : [],
        };
    } else {
        return {
            cmTable,
            anchorColumn: undefined,
            anchorRow: undefined,
            initialX: 0,
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
    const { zoomScale, editor } = context;
    const { cmTable, anchorRow } = initValue;

    //TODO: Changes while dragging not updating on editor
    if (cmTable && anchorRow) {
        editor.formatContentModel(
            (model, context) => {
                context.skipUndoSnapshot = true;

                cmTable.rows[anchorRow].height =
                    (cmTable?.rows[anchorRow].height ?? 0) / zoomScale + deltaY;
                normalizeTable(cmTable, model.format);
                return true;
            },
            {
                apiName: 'tableRowResize',
            }
        );
    }

    return true;
}

function onDraggingVertical(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number
) {
    const { editor, zoomScale } = context;
    const { cmTable, anchorColumn, initialX, allWidths } = initValue;

    //TODO: Changes while dragging not updating on editor
    if (cmTable && anchorColumn) {
        editor.formatContentModel(
            (model, context) => {
                context.skipUndoSnapshot = true;

                // This is the last column
                if (anchorColumn == cmTable.widths.length - 1) {
                    // Shift held at start of drag
                    if (allWidths) {
                        // All columns change equally
                        cmTable.widths.forEach((width, index) => {
                            allWidths[index] = width / zoomScale + deltaX;
                        });
                    } else {
                        // Only the last column changes
                        cmTable.widths[anchorColumn] = initialX / zoomScale + deltaX;
                    }
                } else {
                    // Any other two columns
                    const newWidth =
                        cmTable.widths[anchorColumn] + cmTable.widths[anchorColumn + 1] / zoomScale;
                    cmTable.widths[anchorColumn] = newWidth / 2 + deltaX;
                    cmTable.widths[anchorColumn + 1] = newWidth / 2 - deltaX;
                }

                normalizeTable(cmTable, model.format);
                return true;
            },
            {
                apiName: 'tableColumnResize',
            }
        );
    }
    return true;
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
