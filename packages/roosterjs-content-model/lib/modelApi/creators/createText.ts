import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';

/**
 * @internal
 */
export function createText(text: string): ContentModelText {
    return {
        segmentType: ContentModelSegmentType.Text,
        text: text,
    };
}
