import { ChangeSource, EntityOperationEvent, Keys } from 'roosterjs-editor-types';
import { deleteCollapsedSelection } from '../../modelApi/edit/steps/deleteCollapsedSelection';
import { deleteSelection, DeleteSelectionResult } from '../../modelApi/edit/deleteSelection';
import { deleteWordSelection } from '../../modelApi/edit/steps/deleteWordSelection';
import { EditStep } from '../../modelApi/edit/utils/EditStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
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
        let result: DeleteSelectionResult | undefined;

        formatWithContentModel(
            editor,
            which == Keys.DELETE ? 'handleDeleteKey' : 'handleBackspaceKey',
            model => {
                const additionalSteps: (EditStep | null)[] = [
                    shouldDeleteWord(rawEvent) ? deleteWordSelection : null,
                    deleteCollapsedSelection,
                ].filter(x => !!x);

                result = deleteSelection(model, {
                    keyCode: which,
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
                getChangeData: () => rawEvent.which,
            }
        );

        if (result?.addUndoSnapshot) {
            editor.addUndoSnapshot();
        }
    }
}
