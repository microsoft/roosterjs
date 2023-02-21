import { getObjectKeys } from 'roosterjs-editor-dom';
import type { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';

export default function setStyledDecorator(
    editor: IContentModelEditor,
    styleName: string | null,
    tagName: string | null,
    format?: ContentModelSegmentFormat
) {
    formatParagraphWithContentModel(editor, 'setStyledDecorator', para => {
        if (tagName) {
            para.decorator = {
                tagName,
                format: format ?? {},
            };
            if (styleName) {
                para.decorator.styleName = styleName;
            }
            if (format) {
                para.segments.forEach(segment => {
                    Object.assign(segment.format, format);
                });
            }
        } else {
            if (para.decorator?.format) {
                const formatKeysToDelete = getObjectKeys(para.decorator.format);
                para.segments.forEach(segment =>
                    formatKeysToDelete.forEach(key => delete segment.format[key])
                );
            }
            delete para.decorator;
        }
    });
}
