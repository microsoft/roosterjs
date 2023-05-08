import domToContentModel from '../../domToModel/domToContentModel';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * @internal
 */
export function insertContent(
    model: ContentModelDocument,
    htmlContent: DocumentFragment | HTMLElement | ContentModelDocument,
    isFromDarkMode?: boolean
) {
    if (safeInstanceOf(htmlContent, 'Node')) {
        htmlContent = domToContentModel(
            htmlContent,
            {
                isDarkMode: !!isFromDarkMode,
            },
            {
                includeRoot: true,
            }
        );
    }

    setSelection(htmlContent);
    mergeModel(model, htmlContent);
}
