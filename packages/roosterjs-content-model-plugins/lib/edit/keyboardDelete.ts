import { deleteAllSegmentBefore } from './deleteSteps/deleteAllSegmentBefore';
import { deleteEmptyQuote } from './deleteSteps/deleteEmptyQuote';
import { deleteList } from './deleteSteps/deleteList';
import {
    ChangeSource,
    deleteSelection,
    isElementOfType,
    isLinkUndeletable,
    isModifierKey,
    isNodeOfType,
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
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from './deleteSteps/deleteCollapsedSelection';
import type { DOMSelection, DeleteSelectionStep, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Do keyboard event handling for DELETE/BACKSPACE key
 * @param editor The editor object
 * @param rawEvent DOM keyboard event
 * @param handleExpandedSelection Whether to handle expanded selection within a text node by CM
 * @returns True if the event is handled by content model, otherwise false
 */
export function keyboardDelete(
    editor: IEditor,
    rawEvent: KeyboardEvent,
    handleExpandedSelection: boolean = true
) {
    let handled = false;
    const selection = editor.getDOMSelection();

    if (shouldDeleteWithContentModel(selection, rawEvent, handleExpandedSelection)) {
        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(
                    model,
                    getDeleteSteps(rawEvent, !!editor.getEnvironment().isMac),
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

function getDeleteSteps(rawEvent: KeyboardEvent, isMac: boolean): (DeleteSelectionStep | null)[] {
    const isForward = rawEvent.key == 'Delete';
    const deleteAllSegmentBeforeStep =
        shouldDeleteAllSegmentsBefore(rawEvent) && !isForward ? deleteAllSegmentBefore : null;
    const deleteWordSelection = shouldDeleteWord(rawEvent, isMac)
        ? isForward
            ? forwardDeleteWordSelection
            : backwardDeleteWordSelection
        : null;
    const deleteCollapsedSelection = isForward
        ? forwardDeleteCollapsedSelection
        : backwardDeleteCollapsedSelection;
    const deleteQuote = !isForward ? deleteEmptyQuote : null;
    return [
        deleteAllSegmentBeforeStep,
        deleteWordSelection,
        isForward ? null : deleteList,
        deleteCollapsedSelection,
        deleteQuote,
    ];
}

function shouldDeleteWithContentModel(
    selection: DOMSelection | null,
    rawEvent: KeyboardEvent,
    handleExpandedSelection: boolean
) {
    if (!selection) {
        return false; // Nothing to delete
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
