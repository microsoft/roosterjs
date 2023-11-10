import { setListType } from '../../modelApi/list/setListType';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 */
export default function toggleBullet(editor: IStandaloneEditor) {
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
