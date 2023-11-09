import { ChangeSource, deleteSelection, isModifierKey } from 'roosterjs-content-model-editor';
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
import type { DeleteSelectionStep, IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * @internal
 * Do keyboard event handling for DELETE/BACKSPACE key
 * @param editor The Content Model Editor
 * @param rawEvent DOM keyboard event
 * @returns True if the event is handled with this function, otherwise false
 */
export function keyboardDelete(editor: IContentModelEditor, rawEvent: KeyboardEvent): boolean {
    const selection = editor.getDOMSelection();
    const range = selection?.type == 'range' ? selection.range : null;
    let isDeleted = false;

    if (shouldDeleteWithContentModel(range, rawEvent)) {
        editor.formatContentModel(
            (model, context) => {
                const result = deleteSelection(
                    model,
                    getDeleteSteps(rawEvent, !!editor.getEnvironment().isMac),
                    context
                ).deleteResult;

                isDeleted = result != 'notDeleted';

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

    return isDeleted;
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

function shouldDeleteWithContentModel(range: Range | null, rawEvent: KeyboardEvent) {
    return !(
        range?.collapsed &&
        isNodeOfType(range.startContainer, 'TEXT_NODE') &&
        !isModifierKey(rawEvent) &&
        (canDeleteBefore(rawEvent, range) || canDeleteAfter(rawEvent, range))
    );
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
