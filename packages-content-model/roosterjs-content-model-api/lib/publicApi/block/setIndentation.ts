import { normalizeContentModel } from 'roosterjs-content-model-dom';
import { setModelIndentation } from '../../modelApi/block/setModelIndentation';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Indent or outdent to selected paragraphs
 * @param editor The editor to operate on
 * @param indentation Whether indent or outdent
 * @param length The length of pixel to indent/outdent @default 40
 */
export default function setIndentation(
    editor: IStandaloneEditor,
    indentation: 'indent' | 'outdent',
    length?: number
) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            const result = setModelIndentation(model, indentation, length);

            if (result) {
                normalizeContentModel(model);
            }

            context.newPendingFormat = 'preserve';

            return result;
        },
        {
            apiName: 'setIndentation',
        }
    );
}
