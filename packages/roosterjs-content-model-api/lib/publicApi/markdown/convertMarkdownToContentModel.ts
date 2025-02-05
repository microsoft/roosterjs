import { markdownProcessor } from '../../modelApi/markdown/markdownProcessor';
import { mergeModel } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Convert the whole content to ContentModel with the given plain text
 */
export function convertMarkdownToContentModel(editor: IEditor, text: string) {
    editor.formatContentModel(
        (model, context) => {
            const markdownInContentModel = markdownProcessor(text);
            mergeModel(model, markdownInContentModel, context, {
                mergeFormat: 'mergeAll',
            });

            return true;
        },
        {
            apiName: 'convertMarkdownToContentModel',
        }
    );
}
