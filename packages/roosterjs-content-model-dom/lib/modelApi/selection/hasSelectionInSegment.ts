import { hasSelectionInBlock } from './hasSelectionInBlock';
import type { ReadonlyContentModelSegment } from 'roosterjs-content-model-types';

/**
 * Check if there is selection within the given segment
 * @param segment The segment to check
 */
export function hasSelectionInSegment(segment: ReadonlyContentModelSegment): boolean {
    return (
        segment.isSelected ||
        (segment.segmentType == 'General' && segment.blocks.some(hasSelectionInBlock))
    );
}
