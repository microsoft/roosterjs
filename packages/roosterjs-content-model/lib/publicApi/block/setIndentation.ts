import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { indent } from '../../modelApi/block/indent';
import { outdent } from '../../modelApi/block/outdent';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 * @param indentation Whether indent or outdent
 */
export default function setIndentation(
    editor: IExperimentalContentModelEditor,
    indentation: 'indent' | 'outdent'
) {
    formatWithContentModel(editor, 'setIndentation', indentation == 'indent' ? indent : outdent);
}
