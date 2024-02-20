import { setListType } from '../../modelApi/list/setListType';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 * @param removeMargins true to remove margins, false to keep margins @default false
 */
export default function toggleBullet(editor: IEditor, removeMargins: boolean = false) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            context.newPendingFormat = 'preserve';

            return setListType(model, 'UL', removeMargins);
        },
        {
            apiName: 'toggleBullet',
        }
    );
}
