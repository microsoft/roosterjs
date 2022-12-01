import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setModelIndentation } from '../../modelApi/block/setModelIndentation';

/**
 * Toggle bullet list type
 * - When there are some blocks not in bullet list, set all blocks to the given type
 * - When all blocks are already in bullet list, turn off / outdent there list type
 * @param editor The editor to operate on
 * @param indentation Whether indent or outdent
 * @param length The length of pixel to indent/outdent @default 40
 */
export default function setIndentation(
    editor: IExperimentalContentModelEditor,
    indentation: 'indent' | 'outdent',
    length?: number
) {
    formatWithContentModel(editor, 'setIndentation', model =>
        setModelIndentation(model, indentation, length)
    );
}
