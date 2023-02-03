import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

export default function setSpacing(editor: IContentModelEditor, spacing: number | string) {
    formatParagraphWithContentModel(editor, 'setSpacing', paragraph => {
        paragraph.format.lineHeight = spacing.toString();
        paragraph.segments.forEach(segment => {
            if (segment.format.lineHeight) {
                delete segment.format.lineHeight;
            }
        });
    });
}
