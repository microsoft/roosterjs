import { deleteSelection } from '../../modelApi/selection/deleteSelections';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
} from '../../editor/utils/handleKeyboardEventCommon';

/**
 * Handle Delete key event
 */
export default function handleDeleteKey(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    formatWithContentModel(editor, 'handleDeleteKey', model => {
        const { isChanged } = deleteSelection(model, {
            direction: 'forward',
            onDeleteEntity: getOnDeleteEntityCallback(editor, rawEvent),
        });

        handleKeyboardEventResult(editor, model, rawEvent, isChanged);

        return isChanged;
    });
}
