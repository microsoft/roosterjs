import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api';
import { getCMTableFromTable } from '../utils/getTableFromContentModel';
import {
    cloneModel,
    createContentModelDocument,
    createSelectionMarker,
    getFirstSelectedTable,
    getNodePositionFromEvent,
    isNodeOfType,
    mergeModel,
    mutateBlock,
    normalizeRect,
    setParagraphNotImplicit,
    setSelection,
} from 'roosterjs-content-model-dom';
import type { TableEditFeature } from './TableEditFeature';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type {
    DOMSelection,
    IEditor,
    ReadonlyContentModelTable,
    Rect,
    ShallowMutableContentModelDocument,
} from 'roosterjs-content-model-types';

const TABLE_MOVER_LENGTH = 12;
/**
 * @internal
 */
export const TABLE_MOVER_ID = '_Table_Mover';
const TABLE_MOVER_STYLE_KEY = '_TableMoverCursorStyle';

/**
 * @internal
 * Allows user to move table to another position
 * Contains the function to select whole table
 */
export function createTableMover(
    table: HTMLTableElement,
    editor: IEditor,
    isRTL: boolean,
    onFinishDragging: (table: HTMLTableElement) => void,
    onStart: () => void,
    onEnd: (disposeHandler: boolean) => void,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback,
    disableMovement?: boolean
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableTopVisible(editor, rect, contentDiv as Node)) {
        return null;
    }

    const zoomScale = editor.getDOMHelper().calculateZoomScale();
    const document = table.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; cursor: move; user-select: none; border: 1px solid #808080',
    };

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_MOVER_ID;
    div.style.width = `${TABLE_MOVER_LENGTH}px`;
    div.style.height = `${TABLE_MOVER_LENGTH}px`;

    (anchorContainer || document.body).appendChild(div);

    const context: TableMoverContext = {
        table,
        zoomScale,
        rect,
        isRTL,
        editor,
        div,
        onFinishDragging,
        onStart,
        onEnd,
        disableMovement,
    };

    setDivPosition(context, div);

    const featureHandler = new TableMoverFeature(
        div,
        context,
        () => {},
        disableMovement
            ? { onDragEnd }
            : {
                  onDragStart,
                  onDragging,
                  onDragEnd,
              },
        context.zoomScale,
        onTableEditorCreated,
        editor.getEnvironment().isMobileOrTablet
    );

    return { node: table, div, featureHandler };
}

/**
 * @internal
 * Exported for testing
 */
export interface TableMoverContext {
    table: HTMLTableElement;
    zoomScale: number;
    rect: Rect | null;
    isRTL: boolean;
    editor: IEditor;
    div: HTMLElement;
    onFinishDragging: (table: HTMLTableElement) => void;
    onStart: () => void;
    onEnd: (disposeHandler: boolean) => void;
    disableMovement?: boolean;
}

/**
 * @internal
 * Exported for testing
 */
export interface TableMoverInitValue {
    cmTable: ReadonlyContentModelTable | undefined;
    initialSelection: DOMSelection | null;
    tableRect: HTMLDivElement;
}

class TableMoverFeature extends DragAndDropHelper<TableMoverContext, TableMoverInitValue> {
    private disposer: undefined | (() => void);

    constructor(
        div: HTMLElement,
        context: TableMoverContext,
        onSubmit: (
            context: TableMoverContext,
            trigger: HTMLElement,
            container?: HTMLElement
        ) => void,
        handler: DragAndDropHandler<TableMoverContext, TableMoverInitValue>,
        zoomScale: number,
        onTableEditorCreated?: OnTableEditorCreatedCallback,
        forceMobile?: boolean | undefined
    ) {
        super(div, context, onSubmit, handler, zoomScale, forceMobile);
        this.disposer = onTableEditorCreated?.('TableMover', div);
    }

    dispose(): void {
        this.disposer?.();
        this.disposer = undefined;
        super.dispose();
    }
}

function setDivPosition(context: TableMoverContext, trigger: HTMLElement) {
    const { rect } = context;
    if (rect) {
        trigger.style.top = `${rect.top - TABLE_MOVER_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_MOVER_LENGTH - 2}px`;
    }
}

function isTableTopVisible(editor: IEditor, rect: Rect | null, contentDiv?: Node | null): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (isNodeOfType(contentDiv, 'ELEMENT_NODE') && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return !!containerRect && containerRect.top <= rect.top && visibleViewport.top <= rect.top;
    }

    return true;
}

function setTableMoverCursor(editor: IEditor, state: boolean, type?: 'move' | 'copy') {
    editor?.setEditorStyle(TABLE_MOVER_STYLE_KEY, state ? 'cursor: ' + type ?? 'move' : null);
}

/**
 * @internal
 * Exported for testing
 */
export function onDragStart(context: TableMoverContext): TableMoverInitValue {
    context.onStart();

    const { editor, table, div } = context;

    setTableMoverCursor(editor, true, 'move');

    // Create table outline rectangle
    const trect = table.getBoundingClientRect();
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; user-select: none; border: 1px solid #808080',
    };
    const tableRect = createElement(createElementData, editor.getDocument()) as HTMLDivElement;
    tableRect.style.width = `${trect.width}px`;
    tableRect.style.height = `${trect.height}px`;
    tableRect.style.top = `${trect.top}px`;
    tableRect.style.left = `${trect.left}px`;
    div.parentNode?.appendChild(tableRect);

    // Get drag start selection
    const initialSelection = editor.getDOMSelection();

    // Get Table block in content model
    const cmTable = getCMTableFromTable(editor, table);

    return {
        cmTable,
        initialSelection,
        tableRect,
    };
}

/**
 * @internal
 * Exported for testing
 */
export function onDragging(
    context: TableMoverContext,
    event: MouseEvent,
    initValue: TableMoverInitValue
) {
    const { tableRect } = initValue;
    const { editor } = context;

    // Move table outline rectangle
    tableRect.style.top = `${event.clientY + TABLE_MOVER_LENGTH}px`;
    tableRect.style.left = `${event.clientX + TABLE_MOVER_LENGTH}px`;

    const pos = getNodePositionFromEvent(
        editor.getDocument(),
        editor.getDOMHelper(),
        event.clientX,
        event.clientY
    );
    if (pos) {
        const range = editor.getDocument().createRange();
        range.setStart(pos.node, pos.offset);
        range.collapse(true);

        editor.setDOMSelection({ type: 'range', range, isReverted: false });
        return true;
    }
    return false;
}

/**
 * @internal
 * Exported for testing
 */
export function onDragEnd(
    context: TableMoverContext,
    event: MouseEvent,
    initValue: TableMoverInitValue | undefined
) {
    const { editor, table, onFinishDragging: selectWholeTable, disableMovement } = context;
    const element = event.target;

    // Remove table outline rectangle
    initValue?.tableRect.remove();

    // Reset cursor
    setTableMoverCursor(editor, false);

    if (element == context.div) {
        // Table mover was only clicked, select whole table and do not dismiss the handler element.
        selectWholeTable(table);
        context.onEnd(false /* disposeHandler */);
        return true;
    } else {
        // Check if table was dragged on itself, element is not in editor, or movement is disabled
        if (
            table.contains(element as Node) ||
            !editor.getDOMHelper().isNodeInEditor(element as Node) ||
            disableMovement
        ) {
            editor.setDOMSelection(initValue?.initialSelection ?? null);
            context.onEnd(true /* disposeHandler */);
            return false;
        }

        let insertionSuccess: boolean = false;

        // Get position to insert table
        const insertPosition = getNodePositionFromEvent(
            editor.getDocument(),
            editor.getDOMHelper(),
            event.clientX,
            event.clientY
        );
        if (insertPosition) {
            // Move table to new position
            formatInsertPointWithContentModel(
                editor,
                insertPosition,
                (model, context, ip) => {
                    // Remove old table
                    const [oldTable, path] = getFirstSelectedTable(model);
                    if (oldTable) {
                        const index = path[0].blocks.indexOf(oldTable);
                        mutateBlock(path[0]).blocks.splice(index, 1);
                    }

                    if (ip && initValue?.cmTable) {
                        // Insert new table
                        const doc: ShallowMutableContentModelDocument = createContentModelDocument();
                        doc.blocks.push(oldTable ?? mutateBlock(initValue.cmTable));
                        insertionSuccess = !!mergeModel(model, cloneModel(doc), context, {
                            mergeFormat: 'none',
                            insertPosition: ip,
                        });

                        if (insertionSuccess) {
                            // After mergeModel, the new table should be selected
                            const finalTable = getFirstSelectedTable(model)[0] ?? initValue.cmTable;
                            if (finalTable) {
                                // Add selection marker to the first cell of the table
                                const firstCell = finalTable.rows[0].cells[0];
                                const markerParagraph = firstCell?.blocks[0];

                                if (markerParagraph?.blockType == 'Paragraph') {
                                    const marker = createSelectionMarker(model.format);

                                    mutateBlock(markerParagraph).segments.unshift(marker);
                                    setParagraphNotImplicit(markerParagraph);
                                    setSelection(model, marker);
                                }
                            }
                        }
                        return insertionSuccess;
                    }
                },
                {
                    // Select first cell of the old table
                    selectionOverride: {
                        type: 'table',
                        firstColumn: 0,
                        firstRow: 0,
                        lastColumn: 0,
                        lastRow: 0,
                        table: table,
                    },
                    apiName: 'TableMover',
                }
            );
        } else {
            // No movement, restore initial selection
            editor.setDOMSelection(initValue?.initialSelection ?? null);
        }
        context.onEnd(true /* disposeHandler */);
        return insertionSuccess;
    }
}
