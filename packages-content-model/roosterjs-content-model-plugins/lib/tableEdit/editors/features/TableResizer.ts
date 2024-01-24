import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import { createElement, normalizeRect, safeInstanceOf } from 'roosterjs-editor-dom';
import { getFirstSelectedTable, normalizeTable } from 'roosterjs-content-model-core';
import type { ContentModelTable, IStandaloneEditor, Rect } from 'roosterjs-content-model-types';
import type TableEditFeature from './TableEditorFeature';
import type { CreateElementData } from 'roosterjs-editor-types';

const TABLE_RESIZER_LENGTH = 12;
const MIN_CELL_WIDTH = 30;
const MIN_CELL_HEIGHT = 20;

/**
 * @internal
 */
export default function createTableResizer(
    table: HTMLTableElement,
    editor: IStandaloneEditor,
    isRTL: boolean,
    onStart: () => void,
    onEnd: () => false,
    onShowHelperElement?: (
        elementData: CreateElementData,
        helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
    ) => void,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableBottomVisible(editor, rect, contentDiv)) {
        return null;
    }

    const document = table.ownerDocument;
    const zoomScale = editor.getZoomScale();
    const createElementData = {
        tag: 'div',
        style: `position: fixed; cursor: ${
            isRTL ? 'ne' : 'nw'
        }-resize; user-select: none; border: 1px solid #808080`,
    };

    onShowHelperElement?.(createElementData, 'TableResizer');

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.style.width = `${TABLE_RESIZER_LENGTH}px`;
    div.style.height = `${TABLE_RESIZER_LENGTH}px`;

    (anchorContainer || document.body).appendChild(div);

    const context: DragAndDropContext = {
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

    const featureHandler = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
        div,
        context,
        hideResizer, // Resizer is hidden while dragging only
        {
            onDragStart,
            onDragging,
            onDragEnd,
        },
        zoomScale
    );

    return { node: table, div, featureHandler };
}

interface DragAndDropContext {
    table: HTMLTableElement;
    isRTL: boolean;
    zoomScale: number;
    onStart: () => void;
    onEnd: () => false;
    div: HTMLDivElement;
    editor: IStandaloneEditor;
    contentDiv?: EventTarget | null;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
    cmTable: ContentModelTable | undefined;
}

function onDragStart(context: DragAndDropContext, event: MouseEvent) {
    context.onStart();

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
    const cmTable = getFirstSelectedTable(editor.createContentModel());

    // Restore selection
    editor.setDOMSelection(selection);

    return {
        originalRect: table.getBoundingClientRect(),
        cmTable: cmTable[0],
    };
}

function onDragging(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { isRTL, zoomScale, editor, table } = context;
    const { originalRect, cmTable } = initValue;

    const ratioX = 1.0 + (deltaX / originalRect.width) * zoomScale * (isRTL ? -1 : 1);
    const ratioY = 1.0 + (deltaY / originalRect.height) * zoomScale;
    const shouldResizeX = Math.abs(ratioX - 1.0) > 1e-3;
    const shouldResizeY = Math.abs(ratioY - 1.0) > 1e-3;

    //TODO: Changes while dragging not updating on editor
    if (cmTable && cmTable.rows && (shouldResizeX || shouldResizeY)) {
        editor.formatContentModel(
            (model, context) => {
                context.skipUndoSnapshot = true;

                for (let i = 0; i < cmTable.rows.length; i++) {
                    for (let j = 0; j < cmTable.rows[i].cells.length; j++) {
                        const cell = cmTable.rows[i].cells[j];
                        if (cell) {
                            if (shouldResizeX) {
                                // the width of some external table is fixed, we need to make it resizable
                                // TODO: maybe move outside or eliminate
                                table.style.setProperty('width', null);
                                const newWidth = ((cmTable.widths[j] ?? 0) * ratioX) / zoomScale;
                                cell.format.useBorderBox = true;
                                if (newWidth >= MIN_CELL_WIDTH) {
                                    cmTable.widths[j] = newWidth;
                                }
                            }

                            if (shouldResizeY) {
                                // the height of some external table is fixed, we need to make it resizable
                                // TODO: maybe move outside or eliminate
                                table.style.setProperty('height', null);
                                if (j == 0) {
                                    const newHeight =
                                        ((cmTable.rows[i].height ?? 0) * ratioY) / zoomScale;
                                    if (newHeight >= MIN_CELL_HEIGHT) {
                                        cmTable.rows[i].height = newHeight;
                                    }
                                }
                            }
                        }
                    }
                }

                normalizeTable(cmTable, model.format);
                return true;
            },
            {
                apiName: 'tableResize',
            }
        );
        return true;
    } else {
        return false;
    }
}

function onDragEnd(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue | undefined
) {
    if (
        isTableBottomVisible(
            context.editor,
            normalizeRect(context.table.getBoundingClientRect()),
            context.contentDiv
        )
    ) {
        context.div.style.visibility = 'visible';
        setDivPosition(context, context.div);
    }
    context.onEnd();
    return false;
}

function setDivPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { table, isRTL } = context;
    const rect = normalizeRect(table.getBoundingClientRect());

    if (rect) {
        trigger.style.top = `${rect.bottom}px`;
        trigger.style.left = isRTL
            ? `${rect.left - TABLE_RESIZER_LENGTH - 2}px`
            : `${rect.right}px`;
    }
}

function hideResizer(context: DragAndDropContext, trigger: HTMLElement) {
    trigger.style.visibility = 'hidden';
}

function isTableBottomVisible(
    editor: IStandaloneEditor,
    rect: Rect | null,
    contentDiv?: EventTarget | null
): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (contentDiv && safeInstanceOf(contentDiv, 'HTMLElement') && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return (
            !!containerRect &&
            containerRect.bottom >= rect.bottom &&
            visibleViewport.bottom >= rect.bottom
        );
    }

    return true;
}
