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

    if (which == Keys.DELETE || which == Keys.BACKSPACE) {
        const isForward = which == Keys.DELETE;
        const apiName = isForward ? 'handleDeleteKey' : 'handleBackspaceKey';
        const deleteCollapsedSelection = isForward
            ? forwardDeleteCollapsedSelection
            : backwardDeleteCollapsedSelection;
        const deleteWordSelection = shouldDeleteWord(rawEvent)
            ? isForward
                ? forwardDeleteWordSelection
                : backwardDeleteWordSelection
            : null;

        formatWithContentModel(
            editor,
            apiName,
            model => {
                const steps: (DeleteSelectionStep | null)[] = [
                    shouldDeleteAllSegmentsBefore(rawEvent) ? deleteAllSegmentBefore : null,
                    deleteWordSelection,
                    deleteCollapsedSelection,
                ];

                const result = deleteSelection(
                    model,
                    getOnDeleteEntityCallback(editor, rawEvent, triggeredEntityEvents),
                    steps
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
}
