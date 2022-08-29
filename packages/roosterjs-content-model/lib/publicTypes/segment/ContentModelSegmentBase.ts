import { ContentModelSegmentType } from '../enum/SegmentType';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<T extends ContentModelSegmentType> {
    /**
     * Type of this segment
     */
    segmentType: T;

    /**
     * Whether this segment is selected
     */
    isSelected?: boolean;
}
