import { formatAndKeepPendingFormat } from '../../modelApi/format/pendingFormat';
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
    formatAndKeepPendingFormat(
        editor,
        model => {
            const paragraphs = getSelectedParagraphs(model);

            paragraphs.forEach(setStyleCallback);

            return paragraphs.length > 0;
        },
        {
            apiName,
        }
    );
}
