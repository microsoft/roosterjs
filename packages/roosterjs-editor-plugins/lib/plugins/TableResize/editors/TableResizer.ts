import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import type TableEditFeature from './TableEditorFeature';
import type { CreateElementData, IEditor, Rect } from 'roosterjs-editor-types';
import {
    createElement,
    getComputedStyle,
    normalizeRect,
    safeInstanceOf,
    VTable,
} from 'roosterjs-editor-dom';

const TABLE_RESIZER_LENGTH = 12;
const MIN_CELL_WIDTH = 30;
const MIN_CELL_HEIGHT = 20;

/**
 * @internal
 */
export default function createTableResizer(
    table: HTMLTableElement,
    editor: IEditor,
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
    const isRTL = getComputedStyle(table, 'direction') == 'rtl';
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
    editor: IEditor;
    contentDiv?: EventTarget | null;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
    vTable: VTable;
}

function onDragStart(context: DragAndDropContext) {
    context.onStart();

    return {
        originalRect: context.table.getBoundingClientRect(),
        vTable: new VTable(context.table, true /*normalizeTable*/, context.zoomScale),
    };
}

function onDragging(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { isRTL, zoomScale } = context;
    const { originalRect, vTable } = initValue;
    const ratioX = 1.0 + (deltaX / originalRect.width) * zoomScale * (isRTL ? -1 : 1);
    const ratioY = 1.0 + (deltaY / originalRect.height) * zoomScale;
    const shouldResizeX = Math.abs(ratioX - 1.0) > 1e-3;
    const shouldResizeY = Math.abs(ratioY - 1.0) > 1e-3;

    if (vTable.cells && (shouldResizeX || shouldResizeY)) {
        for (let i = 0; i < vTable.cells.length; i++) {
            for (let j = 0; j < vTable.cells[i].length; j++) {
                const cell = vTable.cells[i][j];
                if (cell.td) {
                    if (shouldResizeX) {
                        // the width of some external table is fixed, we need to make it resizable
                        vTable.table.style.setProperty('width', null);
                        const newWidth = ((cell.width ?? 0) * ratioX) / zoomScale;
                        cell.td.style.boxSizing = 'border-box';
                        if (newWidth >= MIN_CELL_WIDTH) {
                            cell.td.style.wordBreak = 'break-word';
                            cell.td.style.whiteSpace = 'normal';
                            cell.td.style.width = `${newWidth}px`;
                        }
                    }

                    if (shouldResizeY) {
                        // the height of some external table is fixed, we need to make it resizable
                        vTable.table.style.setProperty('height', null);
                        if (j == 0) {
                            const newHeight = ((cell.height ?? 0) * ratioY) / zoomScale;
                            if (newHeight >= MIN_CELL_HEIGHT) {
                                cell.td.style.height = `${newHeight}px`;
                            }
                        } else {
                            cell.td.style.setProperty('height', null);
                        }
                    }
                }
            }
        }

        // To avoid apply format styles when the table is being resizing, the skipApplyFormat is set to true.
        vTable.writeBack(true /**skipApplyFormat*/);
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
    editor: IEditor,
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
