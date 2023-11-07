import { setListType } from '../../modelApi/list/setListType';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 */
export function toggleBullet(editor: IContentModelEditor) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            context.newPendingFormat = 'preserve';

            return setListType(model, 'UL');
        },
        {
            apiName: 'toggleBullet',
        }
    );
}
