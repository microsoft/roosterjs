import { deleteFromSibling } from '../../modelApi/editing/deleteFromSibling';
import { deleteSelectedContent } from '../../modelApi/editing/deleteSelectedContent';
import { DeleteSelectionStep } from '../../modelApi/editing/DeleteSelectionStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { invokeDeleteSteps } from '../../modelApi/editing/invokeDeleteSteps';
import { mergeAfterDelete } from '../../modelApi/editing/mergeAfterDelete';
import { mergeInNewLine } from '../../modelApi/editing/features/mergeIntoNewLine';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
} from '../../editor/utils/handleKeyboardEventCommon';

const DeleteSteps: DeleteSelectionStep[] = [
    deleteSelectedContent,
    mergeInNewLine,
    deleteFromSibling,
    mergeAfterDelete,
];

/**
 * Handle Backspace key event
 */
export default function handleBackspaceKey(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    formatWithContentModel(
        editor,
        'handleBackspaceKey',
        model => {
            const { isChanged } = invokeDeleteSteps(DeleteSteps, model, {
                direction: 'backward',
                onDeleteEntity: getOnDeleteEntityCallback(editor, rawEvent),
            });

            handleKeyboardEventResult(editor, model, rawEvent, isChanged);

            return isChanged;
        },
        {
            skipUndoSnapshot: true, // No need to add undo snapshot for each key down event. We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
        }
    );
}
