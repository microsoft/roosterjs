import { deleteAllSegmentBefore } from './deleteSteps/deleteAllSegmentBefore';
import { deleteEmptyQuote } from './deleteSteps/deleteEmptyQuote';
import { deleteList } from './deleteSteps/deleteList';
import {
    ChangeSource,
    deleteSelection,
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
 * @returns True if the event is handled by content model, otherwise false
 */
export function keyboardDelete(editor: IEditor, rawEvent: KeyboardEvent) {
    let handled = false;
    const selection = editor.getDOMSelection();

    if (shouldDeleteWithContentModel(selection, rawEvent)) {
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

function shouldDeleteWithContentModel(selection: DOMSelection | null, rawEvent: KeyboardEvent) {
    if (!selection) {
        return false; // Nothing to delete
    } else if (selection.type != 'range' || !selection.range.collapsed) {
        return true; // Selection is not collapsed, need to delete all selections
    } else {
        const range = selection.range;

        // When selection is collapsed and is in middle of text node, no need to use Content Model to delete
        return !(
            isNodeOfType(range.startContainer, 'TEXT_NODE') &&
            !isModifierKey(rawEvent) &&
            (canDeleteBefore(rawEvent, range) || canDeleteAfter(rawEvent, range))
        );
    }
}

function canDeleteBefore(rawEvent: KeyboardEvent, range: Range) {
    return rawEvent.key == 'Backspace' && range.startOffset > 1;
}

function canDeleteAfter(rawEvent: KeyboardEvent, range: Range) {
    return (
        rawEvent.key == 'Delete' &&
        range.startOffset < (range.startContainer.nodeValue?.length ?? 0) - 1
    );
}
