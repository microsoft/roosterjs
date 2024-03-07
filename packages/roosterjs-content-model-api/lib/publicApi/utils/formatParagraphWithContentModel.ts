import { getSelectedParagraphs } from 'roosterjs-content-model-dom';
import type { ContentModelParagraph, IEditor } from 'roosterjs-content-model-types';

/**
 * Invoke a callback to format the selected paragraph using Content Model
 * @param editor The editor object
 * @param apiName Name of API this calling this function. This is mostly for logging.
 * @param setStyleCallback The callback to format the paragraph. It will be called with current selected table. If no table is selected, it will not be called.
 */
export function formatParagraphWithContentModel(
    editor: IEditor,
    apiName: string,
    setStyleCallback: (paragraph: ContentModelParagraph) => void
) {
    editor.formatContentModel(
        (model, context) => {
            const paragraphs = getSelectedParagraphs(model);

            paragraphs.forEach(setStyleCallback);
            context.newPendingFormat = 'preserve';

            return paragraphs.length > 0;
        },
        {
            apiName,
        }
    );
}
