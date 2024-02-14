import { getSelectedParagraphs } from 'roosterjs-content-model-core';
import type { ContentModelParagraph, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
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
