import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { FormatContext } from '../types/FormatContext';

/**
 * @internal
 */
export function createText(context: FormatContext, text: string): ContentModelText {
    const result: ContentModelText = {
        segmentType: ContentModelSegmentType.Text,
        text: text,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
