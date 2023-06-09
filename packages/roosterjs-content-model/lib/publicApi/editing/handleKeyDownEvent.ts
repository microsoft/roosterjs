import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, EntityOperationEvent, Keys } from 'roosterjs-editor-types';
import { deleteAllSegmentBefore } from '../../modelApi/edit/deleteSteps/deleteAllSegmentBefore';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { DeleteSelectionStep } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
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
 * Handle KeyDown event
 * Currently only DELETE and BACKSPACE keys are supported
 */
export default function handleKeyDownEvent(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[]
) {
    const which = rawEvent.which;

    formatWithContentModel(
        editor,
        which == Keys.DELETE ? 'handleDeleteKey' : 'handleBackspaceKey',
        model => {
            const result = deleteSelection(
                model,
                getOnDeleteEntityCallback(editor, rawEvent, triggeredEntityEvents),
                getDeleteSteps(rawEvent)
            ).deleteResult;

            return handleKeyboardEventResult(editor, model, rawEvent, result);
        },
        {
            skipUndoSnapshot: true, // No need to add undo snapshot for each key down event. We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
            changeSource: ChangeSource.Keyboard,
            getChangeData: () => which,
        }
    );
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
