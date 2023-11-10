import { getSelectedParagraphs } from 'roosterjs-content-model-core';
import type { ContentModelParagraph, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IStandaloneEditor,
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
