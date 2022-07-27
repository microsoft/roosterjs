import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { FormatContext } from '../../formatHandlers/FormatContext';

/**
 * @internal
 */
export function createBr(context: FormatContext): ContentModelBr {
    const result: ContentModelBr = {
        segmentType: ContentModelSegmentType.Br,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
