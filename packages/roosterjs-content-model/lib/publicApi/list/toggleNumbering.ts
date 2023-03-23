import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { setListType } from '../../modelApi/list/setListType';

/**
 * Toggle numbering list type
 * - When there are some blocks not in numbering list, set all blocks to the given type
 * - When all blocks are already in numbering list, turn off / outdent there list type
 * @param editor The editor to operate on
 */
export default function toggleNumbering(editor: IContentModelEditor) {
    formatWithContentModel(editor, 'toggleNumbering', model => setListType(model, 'OL'), {
        preservePendingFormat: true,
    });
}
