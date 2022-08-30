import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';

/**
 * @internal
 */
export function createText(text: string, format?: ContentModelSegmentFormat): ContentModelText {
    return {
        segmentType: 'Text',
        text: text,
        format: format ? { ...format } : {},
    };
}
