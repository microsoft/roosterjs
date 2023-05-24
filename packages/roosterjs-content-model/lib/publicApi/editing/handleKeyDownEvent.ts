import { ChangeSource, EntityOperationEvent, Keys } from 'roosterjs-editor-types';
import { deleteSelection, DeleteSelectionResult } from '../../modelApi/edit/deleteSelection';
import { EditStep } from '../../modelApi/edit/utils/EditStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../modelApi/edit/steps/deleteWordSelection';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../modelApi/edit/steps/deleteCollapsedSelection';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
    shouldDeleteWord,
} from '../../editor/utils/handleKeyboardEventCommon';

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
        const deleteWordSelection = isForward
            ? forwardDeleteWordSelection
            : backwardDeleteWordSelection;
        let result: DeleteSelectionResult | undefined;

        formatWithContentModel(
            editor,
            apiName,
            model => {
                const additionalSteps: (EditStep | null)[] = [
                    shouldDeleteWord(rawEvent) ? deleteWordSelection : null,
                    deleteCollapsedSelection,
                ].filter(x => !!x);

                result = deleteSelection(model, {
                    onDeleteEntity: getOnDeleteEntityCallback(
                        editor,
                        rawEvent,
                        triggeredEntityEvents
                    ),
                    additionalSteps,
                });

                handleKeyboardEventResult(editor, model, rawEvent, result.isChanged);

                return result.isChanged;
            },
            {
                skipUndoSnapshot: true, // No need to add undo snapshot for each key down event. We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => which,
            }
        );

        if (result?.addUndoSnapshot) {
            editor.addUndoSnapshot();
        }
    }
}
