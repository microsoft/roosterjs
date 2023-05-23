import { ChangeSource, EntityOperationEvent } from 'roosterjs-editor-types';
import { deleteSelection } from '../../modelApi/edit/deleteSelections';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
    shouldDeleteWord,
} from '../../editor/utils/handleKeyboardEventCommon';

/**
 * Handle Delete key event
 */
export default function handleDeleteKey(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[]
) {
    formatWithContentModel(
        editor,
        'handleDeleteKey',
        model => {
            const { isChanged } = deleteSelection(model, {
                direction: 'forward',
                onDeleteEntity: getOnDeleteEntityCallback(editor, rawEvent, triggeredEntityEvents),
                deleteWord: shouldDeleteWord(rawEvent),
            });

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
