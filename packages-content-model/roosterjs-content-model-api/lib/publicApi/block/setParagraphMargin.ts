import { createParagraphDecorator } from 'roosterjs-content-model-dom';
import { formatParagraph } from '../utils/formatParagraph';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggles the current block(s) margin properties.
 * null deletes any existing value, undefined is ignored
 * @param editor The editor to operate on
 * @param marginTop value for top margin
 * @param marginBottom value for bottom margin
 */
export default function setParagraphMargin(
    editor: IStandaloneEditor,
    marginTop?: string | null,
    marginBottom?: string | null
) {
    editor.focus();

    formatParagraph(editor, 'setParagraphMargin', para => {
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
