import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';

export default function setSpacing(
    editor: IExperimentalContentModelEditor,
    spacing: number | string
) {
    formatParagraphWithContentModel(editor, 'setSpacing', paragraph => {
        paragraph.format.lineHeight = spacing.toString();
        paragraph.segments.forEach(segment => {
            if (segment.format.lineHeight) {
                delete segment.format.lineHeight;
            }
        });
    });
}
