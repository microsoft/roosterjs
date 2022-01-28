import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import TableEditFeature from './TableEditorFeature';
import { createElement, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { KnownCreateElementDataIndex, SizeTransformer } from 'roosterjs-editor-types';

const TABLE_RESIZER_LENGTH = 12;
const MIN_CELL_WIDTH = 30;
const MIN_CELL_HEIGHT = 20;

/**
 * @internal
 */
export default function createTableResizer(
    table: HTMLTableElement,
    sizeTransformer: SizeTransformer,
    isRTL: boolean,
    onChange: () => void
): TableEditFeature {
    const document = table.ownerDocument;
    const div = createElement(
        isRTL
            ? KnownCreateElementDataIndex.TableResizerRTL
            : KnownCreateElementDataIndex.TableResizerLTR,
        document
    ) as HTMLDivElement;

    div.style.width = `${TABLE_RESIZER_LENGTH}px`;
    div.style.height = `${TABLE_RESIZER_LENGTH}px`;
    document.body.appendChild(div);

    const context: DragAndDropContext = {
        isRTL,
        table,
        sizeTransformer,
    };

    setResizeDivPosition(context, div);

    const featureHandler = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
        div,
        context,
        (context, trigger) => {
            onChange();
            setResizeDivPosition(context, trigger);
        },
        {
            onDragStart,
            onDragging,
        },
        sizeTransformer
    );

    return { node: table, div, featureHandler };
}

interface DragAndDropContext {
    table: HTMLTableElement;
    isRTL: boolean;
    sizeTransformer: SizeTransformer;
}

interface DragAndDropInitValue {
    originalRect: DOMRect;
    vTable: VTable;
}

function onDragStart(context: DragAndDropContext, event: MouseEvent) {
    return {
        originalRect: context.table.getBoundingClientRect(),
        vTable: new VTable(context.table, true /*normalizeTable*/, context.sizeTransformer),
    };
}

function onDragging(
    context: DragAndDropContext,
    event: MouseEvent,
    initValue: DragAndDropInitValue,
    deltaX: number,
    deltaY: number
) {
    const { isRTL, sizeTransformer } = context;
    const { originalRect, vTable } = initValue;
    const ratioX = 1.0 + (deltaX / sizeTransformer(originalRect.width)) * (isRTL ? -1 : 1);
    const ratioY = 1.0 + deltaY / sizeTransformer(originalRect.height);
    const shouldResizeX = Math.abs(ratioX - 1.0) > 1e-3;
    const shouldResizeY = Math.abs(ratioY - 1.0) > 1e-3;

    if (shouldResizeX || shouldResizeY) {
        for (let i = 0; i < vTable.cells.length; i++) {
            for (let j = 0; j < vTable.cells[i].length; j++) {
                const cell = vTable.cells[i][j];
                if (cell.td) {
                    if (shouldResizeX) {
                        // the width of some external table is fixed, we need to make it resizable
                        vTable.table.style.width = null;
                        const newWidth = sizeTransformer(cell.width * ratioX);
                        cell.td.style.boxSizing = 'border-box';
                        if (newWidth >= MIN_CELL_WIDTH) {
                            cell.td.style.wordBreak = 'break-word';
                            cell.td.style.whiteSpace = 'normal';
                            cell.td.style.width = `${newWidth}px`;
                        }
                    }

                    if (shouldResizeY) {
                        // the height of some external table is fixed, we need to make it resizable
                        vTable.table.style.height = null;
                        if (j == 0) {
                            const newHeight = sizeTransformer(cell.height * ratioY);
                            if (newHeight >= MIN_CELL_HEIGHT) {
                                cell.td.style.height = `${newHeight}px`;
                            }
                        } else {
                            cell.td.style.height = null;
                        }
                    }
                }
            }
        }

        vTable.writeBack();
        return true;
    } else {
        return false;
    }
}

function setResizeDivPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { table, isRTL } = context;
    const rect = normalizeRect(table.getBoundingClientRect());

    if (rect) {
        trigger.style.top = `${rect.bottom}px`;
        trigger.style.left = isRTL
            ? `${rect.left - TABLE_RESIZER_LENGTH - 2}px`
            : `${rect.right}px`;
    }
}
