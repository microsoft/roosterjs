import { ContentModelSegmentType } from '../enum/SegmentType';
import type { CompatibleContentModelSegmentType } from '../compatibleEnum/SegmentType';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType | CompatibleContentModelSegmentType
> {
    /**
     * Type of this segment
     */
    segmentType: T;

    /**
     * Whether this segment is selected
     */
    isSelected?: boolean;
}
