import { createParagraphDecorator } from 'roosterjs-content-model-dom';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Toggles the current block(s) margin properties.
 * null deletes any existing value, undefined is ignored
 * @param editor The editor to operate on
 * @param marginTop value for top margin
 * @param marginBottom value for bottom margin
 */
export default function setParagraphMargin(
    editor: IContentModelEditor,
    marginTop?: string | null,
    marginBottom?: string | null
) {
    formatParagraphWithContentModel(editor, 'setParagraphMargin', para => {
        if (!para.decorator) {
            para.decorator = createParagraphDecorator('p');
        }

        if (marginTop) {
            para.format.marginTop = marginTop;
        } else if (marginTop === null) {
            delete para.format.marginTop;
        }

        if (marginBottom) {
            para.format.marginBottom = marginBottom;
        } else if (marginBottom === null) {
            delete para.format.marginBottom;
        }
    });
}
