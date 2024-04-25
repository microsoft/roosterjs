import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { ensureUniqueId } from 'roosterjs-content-model-core/lib/coreApi/setEditorStyle/ensureUniqueId';
import { paste } from 'roosterjs-content-model-core/lib';
import {
    createContentModelDocument,
    createSelectionMarker,
    extractClipboardItems,
    getFirstSelectedTable,
    getSelectedSegmentsAndParagraphs,
    isNodeOfType,
    mergeModel,
    normalizeRect,
    setParagraphNotImplicit,
    setSelection,
    toArray,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelTable,
    DOMInsertPoint,
    DOMSelection,
    IEditor,
    Rect,
} from 'roosterjs-content-model-types';
import type { TableEditFeature } from './TableEditFeature';

const TABLE_MOVER_LENGTH = 12;
const TABLE_MOVER_ID = '_Table_Mover';

let workaroundChecker = false;

// Get range from coordinate. This is copied from OWA virtual edit code
function getNodePositionFromEvent(editor: IEditor, x: number, y: number): DOMInsertPoint | null {
    const doc = editor.getDocument();
    const domHelper = editor.getDOMHelper();

    if (doc.caretRangeFromPoint) {
        // Chrome, Edge, Safari, Opera
        const range = doc.caretRangeFromPoint(x, y);
        if (range && domHelper.isNodeInEditor(range.startContainer)) {
            return { node: range.startContainer, offset: range.startOffset };
        }
    }

    if ('caretPositionFromPoint' in doc) {
        // Firefox
        const pos = (doc as any).caretPositionFromPoint(x, y);
        if (pos && domHelper.isNodeEditor(pos.offsetNode)) {
            return { node: pos.offsetNode, offset: pos.offset };
        }
    }

    if (doc.elementFromPoint) {
        // Fallback
        const element = doc.elementFromPoint(x, y);
        if (element && domHelper.isNodeEditor(element)) {
            return { node: element, offset: 0 };
        }
    }

    return null;
}

const TableIdKey = 'table-id';
const TableIdContentType = 'text/' + TableIdKey;

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
    onEnd: () => false,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableTopVisible(editor, rect, contentDiv as Node)) {
        return null;
    }

    const zoomScale = editor.getDOMHelper().calculateZoomScale();
    const document = table.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
    };

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_MOVER_ID;
    div.style.width = `${TABLE_MOVER_LENGTH}px`;
    div.style.height = `${TABLE_MOVER_LENGTH}px`;

    //(anchorContainer || document.body).appendChild(div);

    // Broswer Drag Drop Attempt
    const div2 = createElement(createElementData, document) as HTMLDivElement;
    div2.id = TABLE_MOVER_ID;
    div2.style.width = `${TABLE_MOVER_LENGTH}px`;
    div2.style.height = `${TABLE_MOVER_LENGTH}px`;
    div2.style.backgroundColor = 'gray';
    (anchorContainer || document.body).appendChild(div2);
    div2.draggable = true;
    div2.addEventListener('dragstart', event => {
        const id = ensureUniqueId(table, 'table');

        event.dataTransfer?.setData('text/html', table.outerHTML);
        event.dataTransfer?.setData(TableIdContentType, id);
        event.dataTransfer?.setDragImage(table, 0, 0);
        console.log('>>DStart');
    });

    if (!workaroundChecker) {
        workaroundChecker = true;
        editor.attachDomEvent({
            drop: {
                beforeDispatch: e => {
                    //  console.log('drop');
                    const dragEvent = e as DragEvent;
                    const pos = getNodePositionFromEvent(editor, dragEvent.x, dragEvent.y);

                    if (pos && dragEvent.dataTransfer) {
                        dragEvent.preventDefault();

                        const range = editor.getDocument().createRange();

                        range.setStart(pos.node, pos.offset);
                        range.collapse(true);

                        editor.setDOMSelection({ type: 'range', range, isReverted: false });

                        const isCopy = dragEvent.ctrlKey || dragEvent.metaKey;

                        extractClipboardItems(toArray(dragEvent.dataTransfer.items), [
                            TableIdKey,
                        ]).then(clipboard => {
                            if (!editor.isDisposed()) {
                                const tableId = clipboard.customValues[TableIdKey];

                                if (tableId && !isCopy) {
                                    const table = editor
                                        .getDOMHelper()
                                        .queryElements('#' + tableId)[0];

                                    table?.parentNode?.removeChild(table);
                                }

                                paste(editor, clipboard, 'normal');
                            }
                        });
                    }
                },
            },
        });
    }

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
    };

    setDivPosition(context, div2);

    const featureHandler = new DragAndDropHelper<TableMoverContext, TableMoverInitValue>(
        div,
        context,
        () => {},
        {
            onDragStart,
            onDragging,
            onDragEnd,
        },
        context.zoomScale,
        editor.getEnvironment().isMobileOrTablet
    );

    return { node: table, div: div2, featureHandler };
}

interface TableMoverContext {
    table: HTMLTableElement;
    zoomScale: number;
    rect: Rect | null;
    isRTL: boolean;
    editor: IEditor;
    div: HTMLElement;
    onFinishDragging: (table: HTMLTableElement) => void;
    onStart: () => void;
    onEnd: () => false;
}

interface TableMoverInitValue {
    cmTable: ContentModelTable | undefined;
    initialSelection: DOMSelection | null;
    tableRect: HTMLDivElement;
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

function onDragStart(context: TableMoverContext, event: MouseEvent) {
    context.onStart();

    const { editor, table, div } = context;

    // Create table outline rectangle
    const trect = table.getBoundingClientRect();
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; user-select: none; border: 1px solid #808080',
    };
    const tableRect = createElement(createElementData, document) as HTMLDivElement;
    tableRect.style.width = `${trect.width}px`;
    tableRect.style.height = `${trect.height}px`;
    tableRect.style.top = `${trect.top}px`;
    tableRect.style.left = `${trect.left}px`;
    div.parentNode?.appendChild(tableRect);

    // Get current selection
    const initialSelection = editor.getDOMSelection();

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
    const [cmTable] = getFirstSelectedTable(editor.getContentModelCopy('disconnected'));

    // Restore selection
    editor.setDOMSelection(initialSelection);

    return {
        cmTable,
        initialSelection,
        tableRect,
    };
}

function onDragging(context: TableMoverContext, event: MouseEvent, initValue: TableMoverInitValue) {
    // Move table outline rectangle
    const { tableRect } = initValue;
    const { editor, table } = context;
    tableRect.style.top = `${event.clientY + TABLE_MOVER_LENGTH}px`;
    tableRect.style.left = `${event.clientX + TABLE_MOVER_LENGTH}px`;

    if (event.target == context.div) {
        // Dragging has not left the table mover, do nothing
        return false;
    } else {
        // Check if table was dragged on itself, do nothing
        if (table.contains(event.target as Node)) {
            return false;
        }
        const element = event.target as HTMLElement;

        // Check if target is in editor
        if (initValue?.cmTable != undefined && editor.getDOMHelper().isNodeInEditor(element)) {
            let range: Range | undefined;
            // Check if target is the editor itself
            if (!editor.getDOMHelper().isNodeEditor(element)) {
                // Obtain position in text or undefined
                range = getTextPosition(element, event);
                if (!range) {
                    // Cursor is not on text
                    if (!element.hasChildNodes()) {
                        const parent = element.parentElement;
                        if (parent != null) {
                            // Element has no children, set insertion point after the element
                            parent.childNodes.forEach((child, index) => {
                                if ((child as HTMLElement) === element) {
                                    range = document.createRange();
                                    range.setStart(parent, index + 1);
                                }
                            });
                            if (!range) {
                                // Child not found in parent, do nothing
                                return false;
                            }
                        } else {
                            // Element has no parent, do nothing
                            return false;
                        }
                    } else {
                        // Set to end of element
                        range = document.createRange();
                        range.setStart(element, element.childNodes.length);
                    }
                }
            } else {
                // Set to end of editor
                range = document.createRange();
                range.setStart(element, element.childNodes.length);
            }

            range.collapse(true);
            editor.setDOMSelection({ type: 'range', range, isReverted: false });
            return true;
        }
        return false;
    }
}

function onDragEnd(
    context: TableMoverContext,
    event: MouseEvent,
    initValue: TableMoverInitValue | undefined
) {
    const { editor, table, onFinishDragging: selectWholeTable } = context;
    const element = event.target;
    // Remove table outline rectangle
    initValue?.tableRect.remove();

    // Take snapshot before moving table
    editor.takeSnapshot();

    if (element == context.div) {
        // Table mover was only clicked, select whole table
        selectWholeTable(table);
    } else {
        // Check if table was dragged on itself or Check if element is not in editor
        if (
            table.contains(element as Node) ||
            !editor.getDOMHelper().isNodeInEditor(element as Node)
        ) {
            editor.setDOMSelection(initValue?.initialSelection ?? null);
            return cancelMove(context);
        }

        const finalRange = editor.getDOMSelection();
        if (initValue && finalRange?.type == 'range' && initValue?.initialSelection != finalRange) {
            // Move table to new position
            finalRange.range.collapse(true);
            let insertionSuccess: boolean = false;

            // Insert table into content model
            editor.formatContentModel(
                (model, context) => {
                    const SPArray = getSelectedSegmentsAndParagraphs(model, false);
                    if (
                        SPArray.length == 1 &&
                        SPArray[0][0].segmentType == 'SelectionMarker' &&
                        SPArray[0][1] != null
                    ) {
                        const paragraph = SPArray[0][1];
                        paragraph.segments.forEach(segment => {
                            if (segment == SPArray[0][0] && initValue.cmTable) {
                                const doc = createContentModelDocument();
                                doc.blocks.push(initValue.cmTable);
                                insertionSuccess = !!mergeModel(model, doc, context, {
                                    mergeFormat: 'none',
                                });
                                context.skipUndoSnapshot = true;
                                // Add selection marker to the first cell of the table
                                const [finalTable] = getFirstSelectedTable(model);

                                if (finalTable) {
                                    setSelection(model);
                                    const FirstCell = finalTable.rows[0].cells[0];

                                    const markerParagraph = FirstCell?.blocks[0];
                                    if (markerParagraph?.blockType == 'Paragraph') {
                                        const marker = createSelectionMarker(model.format);

                                        markerParagraph.segments.unshift(marker);
                                        setParagraphNotImplicit(markerParagraph);
                                        setSelection(FirstCell, marker);
                                    }
                                } else {
                                    // Restore initial selection
                                    editor.setDOMSelection(initValue.initialSelection);
                                }
                            }
                        });
                    }
                    return true;
                },
                {
                    apiName: 'TableMover',
                    selectionOverride: {
                        type: 'range',
                        range: finalRange.range,
                        isReverted: false,
                    },
                }
            );
            // Remove old table only if insertion was successful
            if (insertionSuccess) {
                table.remove();
                // Take snapshot after moving table
                editor.takeSnapshot();
            }
        } else {
            // No movement, restore initial selection
            editor.setDOMSelection(initValue?.initialSelection ?? null);
        }
        context.onEnd();
        return true;
    }
    return false;
}

function getTextPosition(node: Node, event: MouseEvent): Range | undefined {
    if (node.textContent) {
        if (isNodeOfType(node, 'TEXT_NODE')) {
            const string = node.textContent || '';
            // Deetermine position in text
            for (let i = 0; i < string.length; i++) {
                const range = document.createRange();
                range.setStart(node, 0 + i);
                range.setEnd(node, 1 + i);
                const rect = range.getClientRects()[0];
                if (
                    rect.right >= event.clientX &&
                    rect.top <= event.clientY &&
                    rect.bottom >= event.clientY
                ) {
                    if (event.clientX > rect.left + rect.width / 2) {
                        range.setStart(node, 1 + i);
                    }
                    return range;
                }
            }
        } else {
            if (isNodeOfType(node, 'ELEMENT_NODE')) {
                const elementRect = node.getBoundingClientRect();
                if (
                    !(
                        event.clientX >= elementRect.left &&
                        event.clientX <= elementRect.right &&
                        event.clientY >= elementRect.top &&
                        event.clientY <= elementRect.bottom
                    )
                ) {
                    // Cursor is not on text of element
                    return undefined;
                }
            }
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                const result = getTextPosition(child, event);
                if (result != undefined) {
                    return result;
                }
            }
            return undefined;
        }
    }
}

function cancelMove(context: TableMoverContext) {
    context.onEnd();
    return false;
}
