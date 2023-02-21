import { ContentModelSegment } from '../..';
import type { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { ContentModelStyledText } from '../../publicTypes/segment/ContentModelStyledText';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';

export default function setStyledSegment(
    editor: IContentModelEditor,
    styleName: string | null,
    format?: ContentModelSegmentFormat
) {
    formatSegmentWithContentModel(
        editor,
        'setStyledSegment',
        (format, _, segment) => {
            if (!segment) {
                return;
            }
            if (!styleName && segment.segmentType === 'StyledText') {
                const cleanedSegment = segment as ContentModelSegment & { styleName?: string };
                cleanedSegment.segmentType = 'Text';
                segment.format = {};
                delete cleanedSegment.styleName;
            }
            if (styleName && segment && segment.segmentType.indexOf('Text') > -1) {
                const modifiedSegment = segment as ContentModelStyledText;
                modifiedSegment.segmentType = 'StyledText';
                Object.assign(segment.format, format ?? {});
                modifiedSegment.styleName = styleName;
            }
        },
        undefined
    );
}
