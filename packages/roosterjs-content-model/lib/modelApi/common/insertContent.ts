import domToContentModel from '../../domToModel/domToContentModel';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { safeInstanceOf, wrap } from 'roosterjs-editor-dom';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * @internal
 */
export function insertContent(
    model: ContentModelDocument,
    htmlContent: DocumentFragment | HTMLElement | ContentModelDocument,
    isFromDarkMode?: boolean
) {
    if (safeInstanceOf(htmlContent, 'DocumentFragment')) {
        htmlContent = wrap(htmlContent, 'span');
    }

    if (safeInstanceOf(htmlContent, 'HTMLElement')) {
        htmlContent = domToContentModel(
            htmlContent,
            {
                isDarkMode: !!isFromDarkMode,
                defaultFormat: {},
            },
            {
                includeRoot: true,
            }
        );
    }

    setSelection(htmlContent);
    mergeModel(model, htmlContent);
}
