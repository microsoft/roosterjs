import { setListType } from '../../modelApi/list/setListType';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle numbering list type
 * - When there are some blocks not in numbering list, set all blocks to the given type
 * - When all blocks are already in numbering list, turn off / outdent there list type
 * @param editor The editor to operate on
 */
export function toggleNumbering(editor: IContentModelEditor) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            context.newPendingFormat = 'preserve';

            return setListType(model, 'OL');
        },
        {
            apiName: 'toggleNumbering',
        }
    );
}
