import { formatWithContentModel } from '../utils/formatWithContentModel';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import { setModelIndentation } from '../../modelApi/block/setModelIndentation';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Indent or outdent to selected paragraphs
 * @param editor The editor to operate on
 * @param indentation Whether indent or outdent
 * @param length The length of pixel to indent/outdent @default 40
 */
export default function setIndentation(
    editor: IContentModelEditor,
    indentation: 'indent' | 'outdent',
    length?: number
) {
    formatWithContentModel(
        editor,
        'setIndentation',
        model => {
            const result = setModelIndentation(model, indentation, length);

            if (result) {
                normalizeContentModel(model);
            }

            return result;
        },
        {
            preservePendingFormat: true,
        }
    );
}
