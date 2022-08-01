import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { DomToModelContext } from '../context/DomToModelContext';

/**
 * @internal
 */
export function createBr(context: DomToModelContext): ContentModelBr {
    const result: ContentModelBr = {
        segmentType: ContentModelSegmentType.Br,
    };

    if (context.isInSelection) {
        result.isSelected = true;
    }

    return result;
}
