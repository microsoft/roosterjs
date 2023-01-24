import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelectedParagraphs } from '../../modelApi/selection/collectSelections';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export function formatParagraphWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    setStyleCallback: (paragraph: ContentModelParagraph) => void
) {
    formatWithContentModel(editor, apiName, model => {
        const paragraphs = getSelectedParagraphs(model);

        paragraphs.forEach(setStyleCallback);

        return paragraphs.length > 0;
    });
}
