import { ChangeSource, deleteSelection, isModifierKey } from 'roosterjs-content-model-core';
import { deleteAllSegmentBefore } from './deleteSteps/deleteAllSegmentBefore';
import { isNodeOfType } from 'roosterjs-content-model-dom';
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
import type { IContentModelEditor } from 'roosterjs-content-model-editor';
import type { DOMSelection, DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 * Do keyboard event handling for DELETE/BACKSPACE key
 * @param editor The Content Model Editor
 * @param rawEvent DOM keyboard event
 */
export function keyboardDelete(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    const selection = editor.getDOMSelection();

    if (shouldDeleteWithContentModel(selection, rawEvent)) {
        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(
                    model,
                    getDeleteSteps(rawEvent, !!editor.getEnvironment().isMac),
                    context
                ).deleteResult;

                return handleKeyboardEventResult(editor, model, rawEvent, result, context);
            },
            {
                rawEvent,
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => rawEvent.which,
                apiName: rawEvent.key == 'Delete' ? 'handleDeleteKey' : 'handleBackspaceKey',
            }
        );

        return true;
    }
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
    return [deleteAllSegmentBeforeStep, deleteWordSelection, deleteCollapsedSelection];
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
