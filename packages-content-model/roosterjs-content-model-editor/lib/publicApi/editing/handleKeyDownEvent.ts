import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, Keys, PluginEventType } from 'roosterjs-editor-types';
import { deleteAllSegmentBefore } from '../../modelApi/edit/deleteSteps/deleteAllSegmentBefore';
import { DeleteResult, DeleteSelectionStep } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import {
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
 * @internal
 * Handle KeyDown event
 * Currently only DELETE and BACKSPACE keys are supported
 */
export default function handleKeyDownEvent(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    const which = rawEvent.which;

    formatWithContentModel(
        editor,
        which == Keys.DELETE ? 'handleDeleteKey' : 'handleBackspaceKey',
        (model, context) => {
            const result = deleteSelection(model, getDeleteSteps(rawEvent), context).deleteResult;

            // No need to add undo snapshot for each key down event.
            // We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
            context.skipUndoSnapshot = true;

            switch (result) {
                case DeleteResult.NotDeleted:
                    // We have not delete anything, we will let browser handle this event, so clear cached model if any since the content will be changed by browser
                    editor.cacheContentModel(null);
                    return false;

                case DeleteResult.NothingToDelete:
                    // We known there is nothing to delete, no need to let browser keep handling the event
                    rawEvent.preventDefault();
                    return false;

                case DeleteResult.Range:
                case DeleteResult.SingleChar:
                    // We have deleted what we need from content model, no need to let browser keep handling the event
                    rawEvent.preventDefault();
                    normalizeContentModel(model);

                    if (result == DeleteResult.Range) {
                        // A range is about to be deleted, so add an undo snapshot immediately
                        context.skipUndoSnapshot = false;
                    }

                    // Trigger an event to let plugins know the content is about to be changed by Content Model keyboard editing.
                    // So plugins can do proper handling. e.g. UndoPlugin can decide whether take a snapshot before this change happens.
                    editor.triggerPluginEvent(PluginEventType.BeforeKeyboardEditing, {
                        rawEvent,
                    });

                    return true;
            }
        },
        {
            rawEvent,
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
