import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export function createText(text: string, context: DomToModelContext): ContentModelText {
    const result: ContentModelText = {
        segmentType: ContentModelSegmentType.Text,
        text: text,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
