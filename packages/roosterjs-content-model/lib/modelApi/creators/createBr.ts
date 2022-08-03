import { ContentModelBr } from '../../publicTypes/segment/ContentModelBr';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';

/**
 * @internal
 */
export function createBr(): ContentModelBr {
    return {
        segmentType: ContentModelSegmentType.Br,
    };
}
