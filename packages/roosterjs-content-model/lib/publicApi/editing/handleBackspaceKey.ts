import { ChangeSource, EntityOperationEvent } from 'roosterjs-editor-types';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
} from '../../editor/utils/handleKeyboardEventCommon';

/**
 * Handle Backspace key event
 */
export default function handleBackspaceKey(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[]
) {
    formatWithContentModel(
        editor,
        'handleBackspaceKey',
        model => {
            const { isChanged } = deleteSelection(
                model,
                getOnDeleteEntityCallback(editor, rawEvent, triggeredEntityEvents),
                'backward'
            );

            handleKeyboardEventResult(editor, model, rawEvent, isChanged);

            return isChanged;
        },
        {
            skipUndoSnapshot: true, // No need to add undo snapshot for each key down event. We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
            changeSource: ChangeSource.Keyboard,
            getChangeData: () => rawEvent.which,
        }
    );
}
