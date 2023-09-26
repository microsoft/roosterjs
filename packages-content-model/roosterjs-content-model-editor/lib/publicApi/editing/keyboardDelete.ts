import { Browser, isModifierKey } from 'roosterjs-editor-dom';
import { ChangeSource, Keys, NodeType } from 'roosterjs-editor-types';
import { deleteAllSegmentBefore } from '../../modelApi/edit/deleteSteps/deleteAllSegmentBefore';
import { DeleteResult, DeleteSelectionStep } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from '../../editor/utils/handleKeyboardEventCommon';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../modelApi/edit/deleteSteps/deleteWordSelection';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../modelApi/edit/deleteSteps/deleteCollapsedSelection';

/**
 * Do keyboard event handling for DELETE/BACKSPACE key
 * @param editor The Content Model Editor
 * @param rawEvent DOM keyboard event
 * @returns True if the event is handled with this function, otherwise false
 */
export default function keyboardDelete(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent
): boolean {
    const which = rawEvent.which;
    const selection = editor.getDOMSelection();
    const range = selection.type == 'range' ? selection.range : null;
    let isDeleted = false;

    if (shouldDeleteWithContentModel(range, rawEvent)) {
        formatWithContentModel(
            editor,
            which == Keys.DELETE ? 'handleDeleteKey' : 'handleBackspaceKey',
            (model, context) => {
                const result = deleteSelection(model, getDeleteSteps(rawEvent), context)
                    .deleteResult;

                isDeleted = result != DeleteResult.NotDeleted;

                return handleKeyboardEventResult(editor, model, rawEvent, result, context);
            },
            {
                rawEvent,
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => which,
            }
        );

        return true;
    }

    return isDeleted;
}

function getDeleteSteps(rawEvent: KeyboardEvent): (DeleteSelectionStep | null)[] {
    const isForward = rawEvent.which == Keys.DELETE;
    const deleteAllSegmentBeforeStep =
        shouldDeleteAllSegmentsBefore(rawEvent) && !isForward ? deleteAllSegmentBefore : null;
    const deleteWordSelection = shouldDeleteWord(rawEvent, !!Browser.isMac)
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
        range.startContainer.nodeType == NodeType.Text &&
        !isModifierKey(rawEvent) &&
        (canDeleteBefore(rawEvent, range) || canDeleteAfter(rawEvent, range))
    );
}

function canDeleteBefore(rawEvent: KeyboardEvent, range: Range) {
    return (
        rawEvent.which == Keys.BACKSPACE &&
        (range.startOffset > 1 || range.startContainer.previousSibling)
    );
}

function canDeleteAfter(rawEvent: KeyboardEvent, range: Range) {
    return (
        rawEvent.which == Keys.DELETE &&
        (range.startOffset < (range.startContainer.nodeValue?.length ?? 0) - 1 ||
            range.startContainer.nextSibling)
    );
}
