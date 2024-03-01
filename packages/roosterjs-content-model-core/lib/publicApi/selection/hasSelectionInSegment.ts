import hasSelectionInBlock from './hasSelectionInBlock';
import type { ContentModelSegment } from 'roosterjs-content-model-types';

/**
 * Check if there is selection within the given segment
 * @param segment The segment to check
 */
export default function hasSelectionInSegment(segment: ContentModelSegment): boolean {
    return (
        segment.isSelected ||
        (segment.segmentType == 'General' && segment.blocks.some(hasSelectionInBlock))
    );
}
