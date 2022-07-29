import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { FormatContext } from '../../formatHandlers/FormatContext';

/**
 * @internal
 */
export function createText(text: string, context: FormatContext): ContentModelText {
    const result: ContentModelText = {
        segmentType: ContentModelSegmentType.Text,
        text: text,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
