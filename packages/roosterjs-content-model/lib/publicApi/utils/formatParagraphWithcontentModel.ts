import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { formatWithContentModel } from './formatWithContentModel';
import { getSelections } from '../../modelApi/selection/getSelections';
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
        const selections = getSelections(model);

        selections.forEach(selection => {
            const para = selection.paragraph;

            if (para) {
                setStyleCallback(para);
            }
        });

        return selections.length > 0;
    });
}
