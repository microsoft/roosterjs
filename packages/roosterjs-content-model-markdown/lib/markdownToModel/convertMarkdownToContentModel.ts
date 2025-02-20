import { markdownProcessor } from './processor/markdownProcessor';
import { mergeModel } from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param editor The editor instance
 * @param text The markdown text
 * @param splitLinesPattern The pattern to split lines. Default is /\r\n|\r|\\n|\n/
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(
    editor: IEditor,
    text: string,
    splitLinesPattern?: string
) {
    editor.formatContentModel(
        (model, context) => {
            if (text.trim() === '') {
                return false;
            }
            const markdownInContentModel = markdownProcessor(text, splitLinesPattern);
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
