import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { hasSelectionInBlock } from './hasSelectionInBlock';

/**
 * @internal
 */
export function hasSelectionInSegment(segment: ContentModelSegment): boolean {
    return (
        segment.isSelected ||
        (segment.segmentType == 'General' && segment.blocks.some(hasSelectionInBlock))
    );
}
