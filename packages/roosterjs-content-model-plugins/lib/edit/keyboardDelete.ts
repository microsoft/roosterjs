import { deleteAllSegmentBefore } from './deleteSteps/deleteAllSegmentBefore';
import { deleteEmptyQuote } from './deleteSteps/deleteEmptyQuote';
import { deleteList } from './deleteSteps/deleteList';
import { deleteParagraphStyle } from './deleteSteps/deleteParagraphStyle';
import { editTable } from 'roosterjs-content-model-api';
import { getDeleteCollapsedSelection } from './deleteSteps/deleteCollapsedSelection';
import {
    ChangeSource,
    deleteSelection,
    isElementOfType,
    isLinkUndeletable,
    isModifierKey,
    isNodeOfType,
    parseTableCells,
} from 'roosterjs-content-model-dom';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from './handleKeyboardEventCommon';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from './deleteSteps/deleteWordSelection';
import type {
    DOMSelection,
    DeleteSelectionStep,
    IEditor,
    TableDeleteOperation,
} from 'roosterjs-content-model-types';
import type { EditOptions } from './EditOptions';

/**
 * @internal
 * Do keyboard event handling for DELETE/BACKSPACE key
 * @param editor The editor object
 * @param rawEvent DOM keyboard event
 * @param handleExpandedSelection Whether to handle expanded selection within a text node by CM
 * @returns True if the event is handled by content model, otherwise false
 */
export function keyboardDelete(editor: IEditor, rawEvent: KeyboardEvent, options: EditOptions) {
    let handled = false;
    const selection = editor.getDOMSelection();
    const { handleExpandedSelectionOnDelete } = options;
    const tableDeleteType = shouldDeleteTableWithContentModel(selection, rawEvent);

    if (tableDeleteType) {
        editTable(editor, tableDeleteType);
        handled = true;
    } else if (
        shouldDeleteWithContentModel(selection, rawEvent, !!handleExpandedSelectionOnDelete)
    ) {
        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(
                    model,
                    getDeleteSteps(rawEvent, !!editor.getEnvironment().isMac, options),
                    context
                ).deleteResult;

                handled = handleKeyboardEventResult(editor, model, rawEvent, result, context);
                return handled;
            },
            {
                rawEvent,
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => rawEvent.which,
                scrollCaretIntoView: true,
                apiName: rawEvent.key == 'Delete' ? 'handleDeleteKey' : 'handleBackspaceKey',
            }
        );
    }

    return handled;
}

function getDeleteSteps(
    rawEvent: KeyboardEvent,
    isMac: boolean,
    options: EditOptions
): (DeleteSelectionStep | null)[] {
    const isForward = rawEvent.key == 'Delete';
    const deleteAllSegmentBeforeStep =
        shouldDeleteAllSegmentsBefore(rawEvent) && !isForward ? deleteAllSegmentBefore : null;
    const deleteWordSelection = shouldDeleteWord(rawEvent, isMac)
        ? isForward
            ? forwardDeleteWordSelection
            : backwardDeleteWordSelection
        : null;

    const deleteCollapsedSelection = getDeleteCollapsedSelection(
        isForward ? 'forward' : 'backward',
        options
    );

    const deleteQuote = !isForward ? deleteEmptyQuote : null;
    return [
        deleteAllSegmentBeforeStep,
        deleteWordSelection,
        isForward ? null : deleteList,
        deleteCollapsedSelection,
        deleteQuote,
        deleteParagraphStyle,
    ];
}

function shouldDeleteWithContentModel(
    selection: DOMSelection | null,
    rawEvent: KeyboardEvent,
    handleExpandedSelection: boolean
) {
    if (!selection || (rawEvent.key == 'Delete' && rawEvent.shiftKey)) {
        return false; // Nothing to delete or leave it to browser when delete and shift key is pressed so that browser will trigger cut event
    } else if (selection.type != 'range') {
        return true;
    } else if (!selection.range.collapsed) {
        if (handleExpandedSelection) {
            return true; // Selection is not collapsed, need to delete all selections
        }

        const range = selection.range;
        const { startContainer, endContainer } = selection.range;
        const isInSameTextNode =
            startContainer === endContainer && isNodeOfType(startContainer, 'TEXT_NODE');
        return !(
            isInSameTextNode &&
            !isModifierKey(rawEvent) &&
            range.endOffset - range.startOffset < (startContainer.nodeValue?.length ?? 0)
        );
    } else {
        const range = selection.range;
        const startContainer = range.startContainer;
        const startOffset = range.startOffset;

        // When selection is collapsed and is in middle of text node, no need to use Content Model to delete
        return !(
            isNodeOfType(startContainer, 'TEXT_NODE') &&
            !isModifierKey(rawEvent) &&
            (canDeleteBefore(rawEvent, startContainer, startOffset) ||
                canDeleteAfter(rawEvent, startContainer, startOffset))
        );
    }
}

function canDeleteBefore(rawEvent: KeyboardEvent, text: Text, offset: number) {
    if (rawEvent.key != 'Backspace' || offset <= 1) {
        return false;
    }

    const length = text.nodeValue?.length ?? 0;

    if (offset == length) {
        // At the end of text, need to check if next segment is deletable
        const nextSibling = text.nextSibling;
        const isNextSiblingUndeletable =
            isNodeOfType(nextSibling, 'ELEMENT_NODE') &&
            isElementOfType(nextSibling, 'a') &&
            isLinkUndeletable(nextSibling) &&
            !nextSibling.firstChild;

        // If next sibling is undeletable, we cannot let browser handle it since it will remove the anchor
        // So we return false here to let Content Model handle it
        return !isNextSiblingUndeletable;
    } else {
        // In middle of text, we can safely let browser handle deletion
        return true;
    }
}

function canDeleteAfter(rawEvent: KeyboardEvent, text: Text, offset: number) {
    return rawEvent.key == 'Delete' && offset < (text.nodeValue?.length ?? 0) - 1;
}

function shouldDeleteTableWithContentModel(
    selection: DOMSelection | null,
    rawEvent: KeyboardEvent
): TableDeleteOperation | undefined {
    if (
        selection?.type == 'table' &&
        (rawEvent.key == 'Backspace' || (rawEvent.key == 'Delete' && rawEvent.shiftKey))
    ) {
        const { lastRow, lastColumn, table, firstColumn, firstRow } = selection;
        const parsedTable = parseTableCells(table);
        const rowNumber = parsedTable.length;
        const isWholeColumnSelected = firstRow == 0 && lastRow == rowNumber - 1;
        const columnNumber = parsedTable[lastRow].length;
        const isWholeRowSelected = firstColumn == 0 && lastColumn == columnNumber - 1;
        if (isWholeRowSelected && isWholeColumnSelected) {
            return 'deleteTable';
        }

        if (isWholeRowSelected) {
            return 'deleteRow';
        }

        if (isWholeColumnSelected) {
            return 'deleteColumn';
        }
    }
    return undefined;
}
