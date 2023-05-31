import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { getSelectedParagraphs } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    setStyleCallback: (paragraph: ContentModelParagraph) => void
) {
    editor.formatWithContentModel(
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
