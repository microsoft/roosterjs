import { getSelectedParagraphs } from 'roosterjs-content-model-editor';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';
import type { ContentModelParagraph } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IContentModelEditor,
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
