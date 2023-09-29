import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedParagraphs } from '../../modelApi/selection/collectSelections';
import type { ContentModelParagraph } from 'roosterjs-content-model-types';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    setStyleCallback: (paragraph: ContentModelParagraph) => void
) {
    formatWithContentModel(
        editor,
        apiName,
        model => {
            const paragraphs = getSelectedParagraphs(model);

            paragraphs.forEach(setStyleCallback);

            return paragraphs.length > 0;
        },
        {
            preservePendingFormat: true,
        }
    );
}
