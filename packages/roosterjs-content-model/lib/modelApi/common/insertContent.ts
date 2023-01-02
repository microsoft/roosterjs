import domToContentModel from '../../publicApi/domToContentModel';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { safeInstanceOf, wrap } from 'roosterjs-editor-dom';
import { setSelection } from '../../modelApi/selection/setSelection';

/**
 * @internal
 */
export default function insertContent(
    model: ContentModelDocument,
    htmlContent: DocumentFragment | HTMLElement | ContentModelDocument,
    isFromDarkMode?: boolean
) {
    if (safeInstanceOf(htmlContent, 'DocumentFragment')) {
        htmlContent = wrap(htmlContent, 'div');
    }

    if (safeInstanceOf(htmlContent, 'HTMLElement')) {
        htmlContent = domToContentModel(
            htmlContent,
            {
                isDarkMode: !!isFromDarkMode,
                zoomScale: 1,
                isRightToLeft: false,
            },
            {
                includeRoot: true,
            }
        );
    }

    setSelection(htmlContent);
    mergeModel(model, htmlContent);
}
