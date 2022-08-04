import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { hasSelectionInBlock } from './hasSelectionInBlock';

/**
 * @internal
 */
export function hasSelectionInSegment(segment: ContentModelSegment): boolean {
    return (
        segment.isSelected ||
        (segment.segmentType == ContentModelSegmentType.General &&
            segment.blocks.some(hasSelectionInBlock))
    );
}
