import { deleteSelection } from '../../modelApi/selection/deleteSelections';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    getOnDeleteEntityCallback,
    handleKeyboardEventResult,
} from '../../editor/utils/handleKeyboardEventCommon';

/**
 * Handle Backspace key event
 */
export default function handleBackspaceKey(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    formatWithContentModel(editor, 'handleBackspaceKey', model => {
        const { isChanged } = deleteSelection(model, {
            direction: 'backward',
            onDeleteEntity: getOnDeleteEntityCallback(editor, rawEvent),
        });

        handleKeyboardEventResult(editor, model, rawEvent, isChanged);

        return isChanged;
    });
}
