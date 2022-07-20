import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';

/**
 * @internal
 */
export function createText(text: string): ContentModelText {
    const result: ContentModelText = {
        segmentType: ContentModelSegmentType.Text,
        text: text,
    };

    return result;
}
