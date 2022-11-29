import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { defaultImplicitFormatMap } from '../../formatHandlers/utils/defaultStyles';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

type HeaderLevelTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Set header level of selected paragraphs
 * @param editor The editor to set header level to
 * @param headerLevel Level of header, from 1 to 6. Set to 0 means set it back to a regular paragraph
 */
export default function setHeaderLevel(
    editor: IExperimentalContentModelEditor,
    headerLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6
) {
    formatParagraphWithContentModel(editor, 'setHeaderLevel', para => {
        const tag = (headerLevel > 0
            ? 'h' + headerLevel
            : para.header && para.header.headerLevel > 0
            ? 'h' + para.header.headerLevel
            : null) as HeaderLevelTags | null;
        const headerStyle =
            ((tag && defaultImplicitFormatMap[tag]) as ContentModelSegmentFormat) || {};

        if (headerLevel > 0) {
            para.header = {
                headerLevel,
                format: { ...headerStyle },
            };

            para.segments.forEach(segment => {
                Object.assign(segment.format, headerStyle);
            });
        } else {
            delete para.header;

            const headerStyleKeys = getObjectKeys(headerStyle);

            para.segments.forEach(segment => {
                headerStyleKeys.forEach(key => {
                    delete segment.format[key];
                });
            });
        }
    });
}
