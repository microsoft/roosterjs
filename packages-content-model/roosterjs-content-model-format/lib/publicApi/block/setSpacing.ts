import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Sets current selected block(s) line-height property and wipes such property from child segments
 * @param editor The editor to operate on
 * @param spacing Unitless/px value to set line height
 */
export function setSpacing(editor: IContentModelEditor, spacing: number | string) {
    editor.focus();

    formatParagraphWithContentModel(editor, 'setSpacing', paragraph => {
        paragraph.format.lineHeight = spacing.toString();
        paragraph.segments.forEach(segment => {
            if (segment.format.lineHeight) {
                delete segment.format.lineHeight;
            }
        });
    });
}
