import { formatAndKeepPendingFormat } from '../../modelApi/format/pendingFormat';
import { setListType } from '../../modelApi/list/setListType';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 */
export default function toggleBullet(editor: IContentModelEditor) {
    editor.focus();

    formatAndKeepPendingFormat(editor, model => setListType(model, 'UL'), {
        apiName: 'toggleBullet',
    });
}
